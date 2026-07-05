import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
    password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number'),
    email: z.email().optional(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.email('Must be a valid email'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─── Link ──────────────────────────────────────────────────────────────────────

export const createLinkSchema = z.object({
    url: z.url('Must be a valid URL'),
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    username: z.string().max(100).optional(),
    password: z.string().max(255).optional(),
    email: z.email().optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    isFavorite: z.boolean().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateLinkSchema = createLinkSchema.partial();

// ─── Note ──────────────────────────────────────────────────────────────────────

export const createNoteSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().optional(),
    isPinned: z.boolean().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

// ─── Snippet ───────────────────────────────────────────────────────────────────

export const createSnippetSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    language: z.string().max(50).optional(),
    snippetType: z.string().max(50).optional(),
    description: z.string().max(2000).optional(),
    metadata: z.any().optional(),
    isFavorite: z.boolean().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateSnippetSchema = createSnippetSchema.partial();

// ─── Prompt ────────────────────────────────────────────────────────────────────

export const createPromptSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    description: z.string().max(2000).nullable().optional(),
    promptType: z.string().max(50),
    targetAI: z.string().max(50).nullable().optional(),
    expectedOutput: z.string().nullable().optional(),
    isFavorite: z.boolean().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
    variables: z.array(z.object({
        name: z.string().max(100),
        defaultValue: z.string().max(500),
        description: z.string().max(500).nullable().optional(),
    })).optional(),
});

export const updatePromptSchema = createPromptSchema.partial();

// ─── Infrastructure ────────────────────────────────────────────────────────────

export const createInfraSchema = z.object({
    title: z.string().min(1).max(255),
    infraType: z.string().max(50),
    content: z.string().min(1),
    description: z.string().max(2000).optional(),
    metadata: z.any().optional(),
    isFavorite: z.boolean().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateInfraSchema = createInfraSchema.partial();

// ─── Tag ───────────────────────────────────────────────────────────────────────

export const createTagSchema = z.object({
    name: z.string().min(1).max(50),
    color: z.string().max(20).optional(),
});

export const updateTagSchema = createTagSchema.partial();

// ─── Category ──────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    parentId: z.number().int().positive().nullable().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Project ───────────────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    color: z.string().max(20).optional(),
    emoji: z.string().max(10).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const addProjectItemSchema = z.object({
    itemType: z.enum(['link', 'note', 'snippet', 'prompt', 'infrastructure']),
    itemId: z.number().int().positive(),
});

// ─── Prompt Collection ─────────────────────────────────────────────────────────

export const createPromptCollectionSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    color: z.string().max(20).optional(),
});

export const updatePromptCollectionSchema = createPromptCollectionSchema.partial();

export const addPromptCollectionItemSchema = z.object({
    promptId: z.number().int().positive(),
});

// ─── File ──────────────────────────────────────────────────────────────────────

export const updateFileSchema = z.object({
    description: z.string().max(500).optional(),
});

// ─── Feedback ──────────────────────────────────────────────────────────────────

export const createFeedbackSchema = z.object({
    type: z.enum(['bug', 'feature', 'comment']),
    message: z.string().min(1, 'Message is required').max(5000),
});
