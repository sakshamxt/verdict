import asyncHandler from 'express-async-handler';
import Movie from '../models/movie.model.js';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import ErrorResponse from '../utils/errorResponse.js';

// === Movie Management (Admin) ===

// @desc    Admin: Add a new movie
// @route   POST /api/v1/admin/movies
// @access  Private (Admin)
const adminAddMovie = asyncHandler(async (req, res, next) => {
  const { title, description, posterUrl, releaseDate, genre } = req.body;

  const movieExists = await Movie.findOne({ title });
  if (movieExists) {
    return next(new ErrorResponse(`Movie with title "${title}" already exists`, 400));
  }

  const movie = await Movie.create({
    title,
    description,
    posterUrl,
    releaseDate,
    genre,
  });

  res.status(201).json({
    success: true,
    message: 'Movie added successfully by admin',
    data: movie,
  });
});

// @desc    Admin: Update a movie
// @route   PUT /api/v1/admin/movies/:id
// @access  Private (Admin)
const adminUpdateMovie = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id;
  const { title, description, posterUrl, releaseDate, genre } = req.body;

  let movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id ${movieId}`, 404));
  }

  // Check if title is being changed and if the new title already exists for another movie
  if (title && title !== movie.title) {
    const existingMovieWithNewTitle = await Movie.findOne({ title });
    if (existingMovieWithNewTitle && existingMovieWithNewTitle._id.toString() !== movieId) {
      return next(new ErrorResponse(`Another movie with title "${title}" already exists`, 400));
    }
  }

  movie.title = title || movie.title;
  movie.description = description || movie.description;
  movie.posterUrl = posterUrl || movie.posterUrl;
  movie.releaseDate = releaseDate || movie.releaseDate;
  movie.genre = genre || movie.genre;

  const updatedMovie = await movie.save();

  res.status(200).json({
    success: true,
    message: 'Movie updated successfully by admin',
    data: updatedMovie,
  });
});

// @desc    Admin: Delete a movie (and its associated reviews via pre-hook in Movie model)
// @route   DELETE /api/v1/admin/movies/:id
// @access  Private (Admin)
const adminDeleteMovie = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id;
  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id ${movieId}`, 404));
  }

  // The pre 'findOneAndDelete' hook in Movie.js should handle deleting associated reviews.
  // If findByIdAndDelete is used, ensure the hook is for 'findOneAndDelete'
  await Movie.findByIdAndDelete(movieId);

  res.status(200).json({
    success: true,
    message: 'Movie and associated reviews deleted successfully by admin',
    data: { deletedMovieId: movieId },
  });
});

// @desc    Admin: Get a single movie by ID (can be more detailed than public one if necessary)
// @route   GET /api/v1/admin/movies/:id
// @access  Private (Admin)
const adminGetMovieById = asyncHandler(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id).populate({
        path: 'reviews', // If you have the virtual populate setup
        populate: {
            path: 'user',
            select: 'name email'
        }
    });

    if (!movie) {
        return next(
            new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
        );
    }

    // If not using virtual populate, fetch reviews separately like in public controller
    // const reviews = await Review.find({ movie: movie._id }).populate('user', 'name email');

    res.status(200).json({
        success: true,
        data: movie // or structure it with reviews if fetched separately
    });
});


// === User Management (Admin) ===

// @desc    Admin: Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const adminGetAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 }); // Exclude passwords
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Admin: Get user details by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin)
const adminGetUserDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return next(new ErrorResponse(`User not found with ID ${req.params.id}`, 404));
    }
    // Optionally, fetch reviews by this user
    // const userReviews = await Review.find({ user: user._id }).populate('movie', 'title');
    res.status(200).json({
        success: true,
        data: user,
        // reviews: userReviews // if fetched
    });
});

// @desc    Admin: Update user role or other details (e.g., change role)
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin)
const adminUpdateUserRole = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { role, name, email } = req.body; // Allow updating name/email by admin too

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorResponse(`User not found with ID ${userId}`, 404));
  }

  // Prevent admin from changing their own role accidentally via this route or
  // changing the role of the "super admin" if you have such a concept.
  // if (user.email === process.env.ADMIN_EMAIL && role !== 'admin') {
  //   return next(new ErrorResponse('Cannot change the primary admin role.', 403));
  // }

  if (role && !['user', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role. Must be "user" or "admin".', 400));
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (role) user.role = role;

  await user.save(); // Note: this will trigger pre-save hooks if any (e.g. password re-hash if password was changed, but we are not doing it here)

  // Re-fetch to exclude password if not already excluded by schema default for select
  const updatedUser = await User.findById(userId).select('-password');


  res.status(200).json({
    success: true,
    message: 'User details updated by admin',
    data: updatedUser,
  });
});

// @desc    Admin: Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
const adminDeleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorResponse(`User not found with ID ${userId}`, 404));
  }

  // Prevent admin from deleting themselves or the primary admin
  if (user.email === process.env.ADMIN_EMAIL || req.user.id === userId) {
    return next(new ErrorResponse('Cannot delete primary admin or yourself.', 403));
  }

  // Optional: What to do with reviews by this user?
  // 1. Delete them: await Review.deleteMany({ user: userId });
  // 2. Anonymize them (set user to null or a generic "deleted user" - requires schema modification)
  // For now, let's assume we delete them.
  await Review.deleteMany({ user: userId }); // This will NOT trigger individual review hooks for averageRating.
                                            // If average ratings need update, it would be complex.
                                            // A simpler approach is that reviews are just gone.

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: 'User and their reviews deleted by admin',
    data: { deletedUserId: userId },
  });
});


// === Review Management (Admin) ===

// @desc    Admin: Get all reviews
// @route   GET /api/v1/admin/reviews
// @access  Private (Admin)
const adminGetAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({})
    .populate('user', 'name email') // Populate user details
    .populate('movie', 'title')   // Populate movie title
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Admin: Delete any review
// @route   DELETE /api/v1/admin/reviews/:reviewId
// @access  Private (Admin)
const adminDeleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorResponse(`Review not found with ID ${reviewId}`, 404));
  }

  const movieId = review.movie; // Get movieId for averageRating update

  await Review.findByIdAndDelete(reviewId); // This should trigger the post hook for averageRating
  // If the hook isn't reliable for findByIdAndDelete:
  // await Review.calculateAverageRating(movieId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully by admin',
    data: { deletedReviewId: reviewId },
  });
});


export {
  adminAddMovie,
  adminUpdateMovie,
  adminDeleteMovie,
  adminGetMovieById,
  adminGetAllUsers,
  adminGetUserDetails,
  adminUpdateUserRole,
  adminDeleteUser,
  adminGetAllReviews,
  adminDeleteReview,
};