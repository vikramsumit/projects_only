import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import connectDB from './config/database.js';

dotenv.config();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', authRoutes);

// Serve frontend for all non-API routes
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/signup.html'));
    } else {
        res.status(404).json({ success: false, message: 'API route not found' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong!'
            : err.message
    });
});

// Initialize database and start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 Frontend: http://localhost:${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
