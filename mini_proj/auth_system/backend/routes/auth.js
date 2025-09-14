import express from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/authControllers.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/signup', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;
