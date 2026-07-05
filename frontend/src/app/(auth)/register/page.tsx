"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRegister } from "@/features/auth/hooks/useAuth";
import Input from "@/features/shared/ui/Input";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideLockKeyhole,
  LucideMail,
  LucideUser,
  LucideVault,
} from "@/Icons/Icons";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be at most 32 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores")
      .trim(),
    email: z.string().email("Enter a valid email address").trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

// ─── Password strength meter ──────────────────────────────────────────────────

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "var(--danger)" };
  if (score <= 3) return { score, label: "Fair", color: "var(--warning)" };
  if (score <= 4) return { score, label: "Good", color: "var(--success)" };
  return { score, label: "Strong", color: "var(--cyan-400)" };
}

function StrengthMeter({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div className="strength-wrap">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i <= score ? color : "var(--bg-overlay)" }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const passwordValue = watch("password", "");
  const onSubmit = (data: FormData) => registerMutation.mutate(data);

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-page">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <LucideVault width={34} />
            </div>
            <span className="auth-logo-text">NeoVault</span>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Set up your personal vault</p>
          </div>

          {/* Server error / success */}
          {registerMutation.isError && (
            <Alert
              type="error"
              message={
                registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : "Registration failed. Please try again."
              }
            />
          )}

          {/* Form */}
          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              label="Username"
              type="text"
              placeholder="Pick a username"
              leftIcon={LucideUser}
              hint="Letters, numbers and underscores only"
              error={errors.username?.message}
              autoComplete="username"
              autoFocus
              {...register("username")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              leftIcon={LucideMail}
              hint="Used for password recovery"
              error={errors.email?.message}
              autoComplete="email"
              {...register("email")}
            />

            <div className="auth-password-wrap">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                leftIcon={LucideLock}
                error={errors.password?.message}
                autoComplete="new-password"
                rightNode={
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <LucideEyeOff width={14} />
                    ) : (
                      <LucideEye width={14} />
                    )}
                  </button>
                }
                {...register("password")}
              />
              <StrengthMeter password={passwordValue} />
            </div>

            <Input
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your password"
              leftIcon={LucideLockKeyhole}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              rightNode={
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide" : "Show"}
                >
                  {showPassword ? (
                    <LucideEyeOff width={14} />
                  ) : (
                    <LucideEye width={14} />
                  )}
                </button>
              }
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={registerMutation.isPending || isSubmitting}
            >
              Create account
            </Button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const CSS = `
.auth-page {
  min-height:           100dvh;
  display:              flex;
  align-items:          center;
  justify-content:      center;
  background-color:     var(--bg-base);
  background-image:     radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0);
  background-size:      28px 28px;
  padding:              24px 16px;
}
.auth-card {
  width:          100%;
  max-width:      420px;
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-xl);
  padding:        36px 32px;
  box-shadow:     var(--shadow-lg);
  display:        flex;
  flex-direction: column;
  gap:            24px;
  animation:      fadeInUp var(--transition-slow) ease both;
}
@media (max-width: 479px) {
  .auth-card { padding: 28px 20px; border-radius: var(--radius-lg); }
}

.auth-logo {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             10px;
}
.auth-logo-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           42px;
  height:          42px;
}
.auth-logo-text {
  font-size:      var(--text-xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
}

.auth-heading  { text-align: center; }
.auth-title {
  font-size:      var(--text-2xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom:  6px;
}
.auth-subtitle { font-size: var(--text-sm); color: var(--text-tertiary); }

.auth-form { display: flex; flex-direction: column; gap: 16px; }

.auth-password-wrap { display: flex; flex-direction: column; gap: 8px; }

.auth-eye-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           26px;
  height:          26px;
  background:      transparent;
  border:          none;
  border-radius:   var(--radius-sm);
  color:           var(--text-tertiary);
  cursor:          pointer;
  transition:      color var(--transition-fast);
}
.auth-eye-btn:hover { color: var(--text-primary); }

/* Strength meter */
.strength-wrap  { display: flex; align-items: center; gap: 8px; }
.strength-bars  { display: flex; gap: 4px; flex: 1; }
.strength-bar   {
  height:        4px;
  flex:          1;
  border-radius: var(--radius-full);
  transition:    background var(--transition-base);
}
.strength-label { font-size: var(--text-xs); font-weight: 600; min-width: 42px; text-align: right; }

.auth-footer-text { text-align: center; font-size: var(--text-sm); color: var(--text-tertiary); }
.auth-link { color: var(--text-accent); font-weight: 500; transition: color var(--transition-fast); }
.auth-link:hover { color: var(--accent-hover); }
`;
