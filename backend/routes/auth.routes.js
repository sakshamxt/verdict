import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateUserRegistration, validateUserLogin } from '../middlewares/validation.middleware.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', validateUserRegistration, registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', validateUserLogin, loginUser);

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me', protect, getMe);

export default router;