import express from 'express';
import {
  addOrUpdateReview,
  deleteOwnReview,
  editOwnReview,
  getUserMovieReview,
} from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateReviewInput, validateMongoIdParam } from '../middlewares/validation.middleware.js';

const router = express.Router();

// All routes below require authentication (user role)

// @desc    Add or update a review for a movie
// @route   POST /api/v1/reviews/movie/:movieId
// @access  Private (User)
router.post(
    '/movie/:movieId',
    protect, // Only logged-in users
    validateMongoIdParam('movieId'),
    validateReviewInput,
    addOrUpdateReview
);

// @desc    Get a user's review for a specific movie
// @route   GET /api/v1/reviews/movie/:movieId/my-review
// @access  Private (User)
router.get(
    '/movie/:movieId/my-review',
    protect,
    validateMongoIdParam('movieId'),
    getUserMovieReview
);


// @desc    Edit own review
// @route   PUT /api/v1/reviews/:reviewId
// @access  Private (User who owns the review)
router.put(
    '/:reviewId',
    protect,
    validateMongoIdParam('reviewId'),
    validateReviewInput, // Re-use or create a specific one for updates
    editOwnReview
);

// @desc    Delete own review
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private (User who owns the review)
router.delete(
    '/:reviewId',
    protect,
    validateMongoIdParam('reviewId'),
    deleteOwnReview
);


export default router;