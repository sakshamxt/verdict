import axiosInstance from './axiosInstance';

// Fetch all movies (public)
// The backend might support pagination, e.g., /movies?page=1&limit=10
export const getAllMoviesApi = async (params) => {
  return axiosInstance.get('/movies', { params }); // params could be { page, limit, genre, etc. }
};

// Fetch a single movie by ID (public)
export const getMovieByIdApi = async (movieId) => {
  return axiosInstance.get(`/movies/${movieId}`);
};