import asyncHandler from 'express-async-handler';
import Movie from '../models/movie.model.js';
import Review from '../models/review.model.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Fetch all movies (public)
// @route   GET /api/v1/movies
// @access  Public
const getAllMovies = asyncHandler(async (req, res, next) => {
  // Basic pagination example (optional)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  // const endIndex = page * limit; // Not directly used here, but good for metadata
  // const total = await Movie.countDocuments();


  const movies = await Movie.find({})
    .select('_id title posterUrl averageRating') // Only select necessary fields for list view
    .sort({ createdAt: -1 }) // Sort by most recent
    .skip(startIndex)
    .limit(limit);

  if (!movies) {
    return next(new ErrorResponse('No movies found', 404));
  }

  res.status(200).json({
    success: true,
    count: movies.length,
    // pagination: { // Optional pagination metadata
    //   currentPage: page,
    //   totalPages: Math.ceil(total / limit),
    //   limit,
    //   totalMovies: total
    // },
    data: movies,
  });
});

// @desc    Fetch a single movie by ID (public)
// @route   GET /api/v1/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(
      new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
    );
  }

  // Fetch associated reviews and populate user's name
  const reviews = await Review.find({ movie: movie._id })
    .populate('user', 'name') // Populate only the name of the user
    .sort({ createdAt: -1 }); // Sort reviews by most recent

  res.status(200).json({
    success: true,
    data: {
      _id: movie._id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      description: movie.description,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      averageRating: movie.averageRating,
      reviews: reviews.map(review => ({
        _id: review._id,
        text: review.text,
        rating: review.rating,
        user: review.user, // This will be the populated user object { _id, name }
        createdAt: review.createdAt,
      })),
    },
  });
});

export { getAllMovies, getMovieById };