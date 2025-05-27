
import { body, validationResult, param } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};

// Example User Registration Validation
const validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

// Example Login Validation
const validateUserLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Example Movie Input Validation
const validateMovieInput = [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('description').notEmpty().withMessage('Description is required').trim().escape(),
  body('posterUrl').isURL().withMessage('Poster URL must be a valid URL'),
  body('releaseDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Invalid release date format'),
  body('genre').optional().trim().escape(),
  handleValidationErrors,
];

// Example Review Input Validation
const validateReviewInput = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('text').notEmpty().withMessage('Review text is required').trim().escape(),
  param('movieId').isMongoId().withMessage('Invalid Movie ID format'), // If movieId is in params
  // body('movieId').isMongoId().withMessage('Invalid Movie ID format'), // If movieId is in body
  handleValidationErrors,
];


// Example ID param validation
const validateMongoIdParam = (paramName = 'id') => [
    param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
    handleValidationErrors
];


export {
  validateUserRegistration,
  validateUserLogin,
  validateMovieInput,
  validateReviewInput,
  validateMongoIdParam,
  // Add more specific validators as needed
};