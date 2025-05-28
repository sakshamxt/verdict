import axiosInstance from './axiosInstance';

// === Admin - Movie Management ===
export const adminGetAllMoviesApi = async (params) => {
  // Params could include pagination, sort, search query
  return axiosInstance.get('/movies/', { params }); // Assuming a general GET /admin/movies for list
};

export const adminAddMovieApi = async (movieData) => {
  return axiosInstance.post('/admin/movies', movieData);
};

export const adminGetMovieByIdApi = async (movieId) => {
  return axiosInstance.get(`/admin/movies/${movieId}`);
};

export const adminUpdateMovieApi = async (movieId, movieData) => {
  return axiosInstance.put(`/admin/movies/${movieId}`, movieData);
};

export const adminDeleteMovieApi = async (movieId) => {
  return axiosInstance.delete(`/admin/movies/${movieId}`);
};

// === Admin - User Management ===
export const adminGetAllUsersApi = async (params) => {
  return axiosInstance.get('/admin/users', { params });
};

export const adminGetUserByIdApi = async (userId) => {
  return axiosInstance.get(`/admin/users/${userId}`);
};

export const adminUpdateUserApi = async (userId, userData) => {
  // userData might contain { name, email, role }
  return axiosInstance.put(`/admin/users/${userId}`, userData);
};

export const adminDeleteUserApi = async (userId) => {
  return axiosInstance.delete(`/admin/users/${userId}`);
};

// === Admin - Review Management ===
export const adminGetAllReviewsApi = async (params) => {
  return axiosInstance.get('/admin/reviews', { params });
};

export const adminDeleteReviewApi = async (reviewId) => {
  return axiosInstance.delete(`/admin/reviews/${reviewId}`);
};