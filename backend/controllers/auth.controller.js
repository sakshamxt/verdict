import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import generateToken from '../utils/jwtToken.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body; // Role can be optionally sent for admin creation by another admin, but usually defaults

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook in User model
    role: role && req.user?.role === 'admin' ? role : 'user', // Only admin can set role, otherwise 'user'
  });

  if (user) {
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    return next(new ErrorResponse('Invalid user data', 400));
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password'); // Explicitly request password

  if (!user) {
    return next(new ErrorResponse('Invalid credentials (email not found)', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials (password incorrect)', 401));
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Get current logged in user details
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  // req.user is set by the 'protect' middleware
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});


export { registerUser, loginUser, getMe };