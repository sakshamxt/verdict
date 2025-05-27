import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import ErrorResponse from '../utils/errorResponse.js'; // We'll create this util

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new ErrorResponse('No user found with this ID', 401));
      }

      next();
    } catch (error) {
      console.error(error);
      return next(new ErrorResponse('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized, no token', 401));
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) { // Should be caught by protect first, but good for safety
        return next(new ErrorResponse('User not found, authorization cannot proceed', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403 // Forbidden
        )
      );
    }
    next();
  };
};

export { protect, authorize };