import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { PasswordResetToken } from '../entities/PasswordResetToken';
import { RefreshToken } from '../entities/RefreshToken';
import { jwtConfig } from '../config/jwt';
import { sendPasswordResetEmail } from '../utils/mailer';
import { ActivityService } from './Activity.service';

type AuthResult = { user: Partial<User>; accessToken: string; refreshToken: string };

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private resetTokenRepository = AppDataSource.getRepository(PasswordResetToken);
    private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    private activityService = new ActivityService();

    async register(username: string, password: string, email?: string): Promise<AuthResult> {
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) throw new Error('Username already exists');

        if (email) {
            const emailTaken = await this.userRepository.findOne({ where: { email } });
            if (emailTaken) throw new Error('Email already in use');
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({ username, passwordHash, email });
        await this.userRepository.save(user);

        return this.buildAuthResult(user);
    }

    async login(username: string, password: string): Promise<AuthResult> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) throw new Error('Invalid credentials');

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) throw new Error('Invalid credentials');

        await this.activityService.log({
            userId: user.id,
            type: 'login',
            module: 'auth',
            action: 'Logged in',
            method: 'POST',
            path: '/api/auth/login',
        });

        return this.buildAuthResult(user);
    }

    async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        // Verify JWT signature first (fast check before hitting DB)
        let payload: any;
        try {
            payload = jwt.verify(rawRefreshToken, jwtConfig.refreshSecret);
        } catch {
            throw new Error('Invalid refresh token');
        }

        const tokenHash = this.hashToken(rawRefreshToken);
        const stored = await this.refreshTokenRepository.findOne({
            where: { tokenHash, revoked: false },
        });

        if (!stored || stored.expiresAt < new Date()) {
            throw new Error('Invalid refresh token');
        }

        const user = await this.userRepository.findOne({ where: { id: stored.userId } });
        if (!user) throw new Error('User not found');

        // Rotate: revoke old token, issue new one
        stored.revoked = true;
        await this.refreshTokenRepository.save(stored);

        const newRefreshToken = await this.generateAndStoreRefreshToken(user);
        const accessToken = this.generateAccessToken(user);

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(rawRefreshToken: string): Promise<void> {
        const tokenHash = this.hashToken(rawRefreshToken);
        await this.refreshTokenRepository.update({ tokenHash }, { revoked: true });
    }

    async getCurrentUser(userId: number): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        return this.sanitizeUser(user);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return;

        await this.resetTokenRepository.update({ userId: user.id, used: false }, { used: true });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const resetToken = this.resetTokenRepository.create({ token, userId: user.id, expiresAt });
        await this.resetTokenRepository.save(resetToken);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        await sendPasswordResetEmail(email, `${frontendUrl}/reset-password?token=${token}`);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const resetToken = await this.resetTokenRepository.findOne({ where: { token, used: false } });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired reset link');
        }

        const user = await this.userRepository.findOne({ where: { id: resetToken.userId } });
        if (!user) throw new Error('User not found');

        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await this.userRepository.save(user);

        resetToken.used = true;
        await this.resetTokenRepository.save(resetToken);

        // Revoke all existing refresh tokens for security
        await this.refreshTokenRepository.update({ userId: user.id, revoked: false }, { revoked: true });
    }

    // ─── Private helpers ───────────────────────────────────────────────────────

    private async buildAuthResult(user: User): Promise<AuthResult> {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateAndStoreRefreshToken(user);
        return { user: this.sanitizeUser(user), accessToken, refreshToken };
    }

    private generateAccessToken(user: User): string {
        return jwt.sign(
            { userId: user.id, username: user.username },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn } as jwt.SignOptions,
        );
    }

    private async generateAndStoreRefreshToken(user: User): Promise<string> {
        const raw = jwt.sign(
            { userId: user.id },
            jwtConfig.refreshSecret,
            { expiresIn: jwtConfig.refreshExpiresIn } as jwt.SignOptions,
        );

        const decoded = jwt.decode(raw) as { exp: number };
        const expiresAt = new Date(decoded.exp * 1000);

        const refreshToken = this.refreshTokenRepository.create({
            tokenHash: this.hashToken(raw),
            userId: user.id,
            expiresAt,
        });
        await this.refreshTokenRepository.save(refreshToken);

        return raw;
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    private sanitizeUser(user: User): Partial<User> {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}
