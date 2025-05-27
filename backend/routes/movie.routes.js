import express from 'express';
import {
  getAllMovies,
  getMovieById,
} from '../controllers/movie.controller.js';
import { validateMongoIdParam } from '../middlewares/validation.middleware.js';

const router = express.Router();

// @desc    Fetch all movies
// @route   GET /api/v1/movies
// @access  Public
router.get('/', getAllMovies);

// @desc    Fetch a single movie by ID
// @route   GET /api/v1/movies/:id
// @access  Public
router.get('/:id', validateMongoIdParam('id'), getMovieById);


export default router;