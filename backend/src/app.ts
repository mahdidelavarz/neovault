import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { AppDataSource } from './config/database';
import { initSearchIndexes } from './config/searchIndexes';
import authRoutes from './routes/auth.route';
import { errorHandler } from './middleware/errorHandler';
import linkRoutes from './routes/links.route';
import categoryRoutes from './routes/category.route';
import tagRoutes from './routes/tag.route';
import noteRoutes from './routes/note.route';
import snippetRoutes from './routes/snippet.route';
import searchRoutes from './routes/search.route';
import promptRoutes from './routes/prompt.route';
import dashboardRoutes from './routes/dashboard.route';
import apiRoutes from './routes/api.route';
import infraRoutes from './routes/Infra.route';
import vaultRoutes from './routes/vault.route';
import projectRoutes from './routes/project.route';
import promptCollectionRoutes from './routes/promptCollection.route';
import adminRoutes from './routes/admin.route';
import fileRoutes from './routes/files.route';
import feedbackRoutes from './routes/feedback.route';
import swaggerRouter from './config/swagger';

const app = express();

// Middleware
app.use(helmet());
// In development, reflect the requesting origin so any LAN device works.
// In production, restrict to the configured allow-list.
const isDev = process.env.NODE_ENV !== 'production';

// CORS_ORIGIN / ALLOWED_ORIGINS may each be a comma-separated list. The `cors`
// package does NOT split a string on commas — it compares the whole string to the
// request Origin, so passing "a,b" never matches and the browser blocks the response
// (which surfaces in the client as a "network error"). Parse them into an array.
const allowedOrigins = [
    ...(process.env.CORS_ORIGIN?.split(',') ?? []),
    ...(process.env.ALLOWED_ORIGINS?.split(',') ?? []),
]
    .map((o) => o.trim())
    .filter(Boolean);

// A literal "*" anywhere in the config means "allow any origin".
const allowAllOrigins = allowedOrigins.includes('*');

app.use(cors({
    origin: isDev
        ? (origin, cb) => cb(null, origin || '*')   // allow any origin in dev
        : (origin, cb) => {
            // Allow non-browser clients (no Origin), an explicit "*", or when nothing
            // is configured, by reflecting the caller's origin. Reflecting a specific
            // origin (rather than literal "*") is what keeps credentialed requests valid.
            if (!origin || allowAllOrigins || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return cb(null, true);
            }
            // Disallowed origin: omit CORS headers (browser will block) but do NOT
            // throw — throwing here turns every cross-origin request into a 500.
            return cb(null, false);
        },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger UI
app.use('/api/docs', swaggerRouter);

// Disable HTTP caching for all API responses so browsers never return 304 stale data
app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/snippets' , snippetRoutes)
app.use('/api/search', searchRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/api-client', apiRoutes);
app.use('/api/infrastructure', infraRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/prompt-collections', promptCollectionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Database connection
AppDataSource.initialize()
    .then(async () => {
        console.log('Database connected successfully');
        if (process.env.DB_SYNCHRONIZE !== 'true') {
            await AppDataSource.runMigrations();
            console.log('Migrations applied');
        }
        await initSearchIndexes();
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

export default app;