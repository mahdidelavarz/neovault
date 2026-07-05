import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

const storage = multer.diskStorage({
    destination: path.join(process.cwd(), 'uploads'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${randomUUID()}${ext}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
});
