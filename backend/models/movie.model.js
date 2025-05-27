import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description'],
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide a poster URL'],
      match: [/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/, 'Please use a valid image URL (jpg, jpeg, gif, png)'],
    },
    releaseDate: {
      type: Date,
    },
    genre: {
      type: String,
      trim: true,
    },
    // averageRating will be calculated and stored
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      set: (val) => Math.round(val * 10) / 10, // Rounds to one decimal place
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews (if needed for direct population, but typically fetched separately for performance)
movieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
  justOne: false,
});

// Pre-hook for 'findOneAndDelete' to remove associated reviews
movieSchema.pre('findOneAndDelete', async function(next) {
  const movieId = this.getQuery()['_id']; // Get the ID of the movie being deleted``
  try {
    await mongoose.model('Review').deleteMany({ movie: movieId });
    next();
  } catch (error) {
    next(error);
  }
});

// Indexing for frequently queried fields
movieSchema.index({ title: 'text', genre: 'text' }); // For text search if needed
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ averageRating: -1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;