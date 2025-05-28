import axiosInstance from './axiosInstance';

// Add or update a review for a movie (requires authentication)
// The backend route is POST /reviews/movie/:movieId
// It handles both creation and update based on user's existing review
export const addOrUpdateReviewApi = async (movieId, reviewData) => {
  // reviewData: { rating, text }
  return axiosInstance.post(`/reviews/movie/${movieId}`, reviewData);
};

// Get the current user's review for a specific movie (requires authentication)
export const getUserMovieReviewApi = async (movieId) => {
  return axiosInstance.get(`/reviews/movie/${movieId}/my-review`);
};


// Edit own review (requires authentication)
// PUT /reviews/:reviewId
export const editOwnReviewApi = async (reviewId, reviewData) => {
    // reviewData: { rating, text }
    return axiosInstance.put(`/reviews/${reviewId}`, reviewData);
};


// Delete own review (requires authentication)
// DELETE /reviews/:reviewId
export const deleteOwnReviewApi = async (reviewId) => {
  return axiosInstance.delete(`/reviews/${reviewId}`);
};

// Note: Admin functionalities for deleting any review would be in adminApi.js