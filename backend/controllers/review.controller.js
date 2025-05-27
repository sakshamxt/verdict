import asyncHandler from 'express-async-handler';
import Review from '../models/review.model.js';
import Movie from '../models/movie.model.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Add or Update a review for a movie
// @route   POST /api/v1/reviews/movie/:movieId
// @access  Private (User)
const addOrUpdateReview = asyncHandler(async (req, res, next) => {
  const { movieId } = req.params;
  const { rating, text } = req.body;
  const userId = req.user._id; // From 'protect' middleware

  if (!rating || !text) {
    return next(new ErrorResponse('Rating and text are required', 400));
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new ErrorResponse(`Movie not found with ID ${movieId}`, 404));
  }

  let review = await Review.findOne({ movie: movieId, user: userId });

  if (review) {
    // Update existing review
    review.rating = rating;
    review.text = text;
    await review.save(); // This will trigger the 'save' hook in Review model
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } else {
    // Create new review
    review = await Review.create({
      movie: movieId,
      user: userId,
      rating,
      text,
    });
    // The 'save' hook in Review model handles averageRating update
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  }
});


// @desc    Get a user's review for a specific movie
// @route   GET /api/v1/reviews/movie/:movieId/my-review
// @access  Private (User)
const getUserMovieReview = asyncHandler(async (req, res, next) => {
    const { movieId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ movie: movieId, user: userId }).populate('user', 'name');

    if (!review) {
        // It's not an error if a user hasn't reviewed a movie yet.
        // Send an empty response or a specific status.
        return res.status(200).json({
            success: true,
            message: 'User has not reviewed this movie yet.',
            data: null
        });
    }

    res.status(200).json({
        success: true,
        data: review
    });
});


// @desc    Edit own review
// @route   PUT /api/v1/reviews/:reviewId
// @access  Private (User who owns the review)
const editOwnReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, text } = req.body;
  const userId = req.user._id;

  if (!rating && !text) {
    return next(new ErrorResponse('At least rating or text must be provided for update', 400));
  }

  let review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorResponse(`Review not found with ID ${reviewId}`, 404));
  }

  // Check if the logged-in user is the owner of the review
  if (review.user.toString() !== userId.toString()) {
    return next(new ErrorResponse('Not authorized to update this review', 403));
  }

  if (rating) review.rating = rating;
  if (text) review.text = text;

  await review.save(); // Triggers 'save' hook for averageRating update

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});


// @desc    Delete own review
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private (User who owns the review)
const deleteOwnReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorResponse(`Review not found with ID ${reviewId}`, 404));
  }

  // Check if the logged-in user is the owner of the review
  if (review.user.toString() !== userId.toString()) {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  const movieId = review.movie; // Get movieId before deleting for averageRating update

  // Use findOneAndDelete to trigger the 'findOneAndDelete' hook if Review.js
  await Review.findByIdAndDelete(reviewId);
  // The hook reviewSchema.post('findOneAndDelete', ...) in Review.js will handle average rating.
  // If that hook isn't reliable for some Mongoose versions/setups, you can explicitly call it:
  // await Review.calculateAverageRating(movieId);


  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: {}, // Or send back the deleted review id: { deletedReviewId: reviewId }
  });
});

export { addOrUpdateReview, getUserMovieReview, editOwnReview, deleteOwnReview };