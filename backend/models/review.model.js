import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Review text cannot be empty'],
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Review must belong to a movie'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure a user can only review a movie once (compound index)
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// Static method to calculate and update average rating on the Movie
reviewSchema.statics.calculateAverageRating = async function (movieId) {
  const Movie = mongoose.model('Movie'); // Dynamically require Movie model here

  const stats = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: '$movie',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await Movie.findByIdAndUpdate(movieId, {
        averageRating: parseFloat(stats[0].avgRating.toFixed(1)), // Round to 1 decimal place
      });
    } else {
      // No reviews, set average rating to 0
      await Movie.findByIdAndUpdate(movieId, {
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error('Error updating average rating:', err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function () {
  // 'this.constructor' refers to the current model (Review)
  this.constructor.calculateAverageRating(this.movie);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.movie);
  }
});


const Review = mongoose.model('Review', reviewSchema);

export default Review;