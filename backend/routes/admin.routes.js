import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import {
  adminAddMovie,
  adminUpdateMovie,
  adminDeleteMovie,
  adminGetAllUsers,
  adminUpdateUserRole,
  adminDeleteUser,
  adminGetAllReviews,
  adminDeleteReview,
  adminGetUserDetails,
  adminGetMovieById, // For admin to see full movie details
} from '../controllers/admin.controller.js';
import {
    validateMovieInput,
    validateMongoIdParam,
    // Add validation for role update if needed
} from '../middlewares/validation.middleware.js';

const router = express.Router();

// All routes below are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

// === Movie Management (Admin) ===
// @desc    Admin: Add a new movie
// @route   POST /api/v1/admin/movies
// @access  Private (Admin)
router.post('/movies', validateMovieInput, adminAddMovie);

// @desc    Admin: Update a movie
// @route   PUT /api/v1/admin/movies/:id
// @access  Private (Admin)
router.put('/movies/:id', validateMongoIdParam('id'), validateMovieInput, adminUpdateMovie);

// @desc    Admin: Delete a movie
// @route   DELETE /api/v1/admin/movies/:id
// @access  Private (Admin)
router.delete('/movies/:id', validateMongoIdParam('id'), adminDeleteMovie);

// @desc    Admin: Get a single movie by ID (can have more details than public one if needed)
// @route   GET /api/v1/admin/movies/:id
// @access  Private (Admin)
router.get('/movies/:id', validateMongoIdParam('id'), adminGetMovieById);


// === User Management (Admin) ===
// @desc    Admin: Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
router.get('/users', adminGetAllUsers);

// @desc    Admin: Get user details by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin)
router.get('/users/:id', validateMongoIdParam('id'), adminGetUserDetails);

// @desc    Admin: Update user role or other details
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin)
// ToDo: Add validation for role update
router.put('/users/:id', validateMongoIdParam('id'), adminUpdateUserRole);

// @desc    Admin: Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', validateMongoIdParam('id'), adminDeleteUser);


// === Review Management (Admin) ===
// @desc    Admin: Get all reviews
// @route   GET /api/v1/admin/reviews
// @access  Private (Admin)
router.get('/reviews', adminGetAllReviews);

// @desc    Admin: Delete any review
// @route   DELETE /api/v1/admin/reviews/:reviewId
// @access  Private (Admin)
router.delete('/reviews/:reviewId', validateMongoIdParam('reviewId'), adminDeleteReview);

export default router;