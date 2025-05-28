import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../../components/movies/MovieCard';
import MovieModal from '../../components/movies/MovieModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAllMoviesApi } from '../../api/movieApi';
import Button from '../../components/ui/Button'; // For pagination

const MovieListingsPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Basic Pagination State (can be enhanced)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 12; // Or get from API response if available

  const fetchMovies = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      // Adjust params if your backend supports pagination, e.g., { page, limit: moviesPerPage }
      const response = await getAllMoviesApi({ page, limit: moviesPerPage });
      // Assuming API response structure: { data: { data: [movies], pagination: { totalPages, currentPage } } }
      // Or simpler: { data: { data: [movies], count: totalMovies } }
      setMovies(response.data.data);

      // Handle pagination data from response if available
      if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
      } else if (response.data.count) { // If API returns total count instead of totalPages
          setTotalPages(Math.ceil(response.data.count / moviesPerPage));
          setCurrentPage(page);
      } else {
          // If no pagination data, assume single page or handle differently
          setTotalPages(1);
          setCurrentPage(1);
      }

    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError(err.response?.data?.error || "Could not load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [moviesPerPage]);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [fetchMovies, currentPage]);

  const handleMovieCardClick = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  const handleReviewChange = () => {
    // Optionally refresh the main movie list if average ratings are shown and updated
    // For now, the modal itself refreshes its movie data.
    // fetchMovies(currentPage); // Or just let modal handle its internal refresh
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading && movies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-danger">{error}</p>
        <Button onClick={() => fetchMovies(1)} className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (!isLoading && movies.length === 0) {
    return <div className="text-center py-20 text-xl text-text-secondary">No movies found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-text-primary mb-10 text-center tracking-tight">
        Explore Our Movie Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onClick={() => handleMovieCardClick(movie._id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-3">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {isModalOpen && selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onReviewSubmitted={handleReviewChange}
        />
      )}
    </div>
  );
};

export default MovieListingsPage;