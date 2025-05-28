import { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import StarRating from '../ui/StarRating';
import LoadingSpinner from '../ui/LoadingSpinner';
import ReviewItem from './ReviewItem';
import AddReviewForm from './AddReviewForm';
import useAuth from '../../hooks/useAuth';
import { getMovieByIdApi } from '../../api/movieApi';
import { addOrUpdateReviewApi, getUserMovieReviewApi, deleteOwnReviewApi } from '../../api/reviewApi';
import { CalendarDaysIcon, LanguageIcon, TicketIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import ConfirmationModal from '../ui/ConfirmationModal'; // For delete confirmation

const MovieModal = ({ movieId, isOpen, onClose, onReviewSubmitted }) => {
  const { isAuthenticated, user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null); // User's own review for this movie
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false); // Separate loading for reviews if needed
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState(null);
  const [editingReview, setEditingReview] = useState(null); // Stores the review being edited
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);


  const fetchMovieDetails = useCallback(async () => {
    if (!movieId) return;
    setLoadingMovie(true);
    try {
      const response = await getMovieByIdApi(movieId);
      setMovie(response.data.data); // Backend returns { success: true, data: { movie_details, reviews: [...] } }
      setReviews(response.data.data.reviews || []);
      setEditingReview(null); // Reset editing state when movie changes
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      // Handle error display if needed
    } finally {
      setLoadingMovie(false);
    }
  }, [movieId]);

  const fetchUserSpecificReview = useCallback(async () => {
    if (!movieId || !isAuthenticated) {
        setUserReview(null);
        return;
    }
    setLoadingReviews(true); // Or a more specific loading state
    try {
        const response = await getUserMovieReviewApi(movieId);
        if (response.data.data) {
            setUserReview(response.data.data);
            setEditingReview(response.data.data); // Pre-fill form if user has a review
        } else {
            setUserReview(null);
            setEditingReview(null); // Clear form if no review
        }
    } catch (error) {
        console.error("Failed to fetch user review:", error);
        setUserReview(null);
        setEditingReview(null);
    } finally {
        setLoadingReviews(false);
    }
  }, [movieId, isAuthenticated]);


  useEffect(() => {
    if (isOpen) {
      fetchMovieDetails();
      fetchUserSpecificReview();
    } else {
      // Reset state when modal closes to avoid showing stale data
      setMovie(null);
      setReviews([]);
      setUserReview(null);
      setEditingReview(null);
      setSubmitReviewError(null);
    }
  }, [isOpen, fetchMovieDetails, fetchUserSpecificReview]);


  const handleReviewSubmit = async (data) => {
    if (!isAuthenticated || !movie) return;
    setLoadingSubmitReview(true);
    setSubmitReviewError(null);
    try {
      // The backend API for addOrUpdateReview handles both cases
      await addOrUpdateReviewApi(movie._id, data);
      // Refresh movie details to get updated average rating and reviews list
      fetchMovieDetails();
      fetchUserSpecificReview(); // Refresh user's own review
      if(onReviewSubmitted) onReviewSubmitted(); // Callback to parent
    } catch (error) {
      console.error("Failed to submit review:", error);
      setSubmitReviewError(error.response?.data?.error || "Failed to submit review.");
    } finally {
      setLoadingSubmitReview(false);
    }
  };

  const handleEditReview = (reviewToEdit) => {
    setEditingReview(reviewToEdit); // This will pre-fill AddReviewForm
    // Scroll to the form maybe
    document.getElementById('add-review-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReviewPrompt = (id) => {
    setReviewToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDeleteId) return;
    try {
        await deleteOwnReviewApi(reviewToDeleteId);
        setShowDeleteConfirm(false);
        setReviewToDeleteId(null);
        fetchMovieDetails(); // Refresh reviews and average rating
        fetchUserSpecificReview(); // Check if user's review was deleted
         if(onReviewSubmitted) onReviewSubmitted(); // Callback to parent
    } catch (error) {
        console.error("Failed to delete review:", error);
        // Show error to user
        setShowDeleteConfirm(false);
    }
  };

  const renderMovieContent = () => {
    if (loadingMovie || !movie) {
      return <div className="flex justify-center items-center min-h-[300px]"><LoadingSpinner size="lg" /></div>;
    }

    const { title, posterUrl, description, averageRating, releaseDate, genre } = movie;

    return (
      <>
        <div className="md:flex md:space-x-6">
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={posterUrl || 'https://via.placeholder.com/400x600.png?text=No+Image'}
              alt={`${title} poster`}
              className="w-full rounded-lg shadow-lg aspect-[2/3] object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600.png?text=No+Image'; }}
            />
          </div>
          <div className="md:w-2/3 mt-6 md:mt-0">
            <h2 className="text-3xl font-bold text-text-primary mb-2">{title}</h2>
            {averageRating > 0 && (
              <div className="flex items-center mb-4">
                <StarRating rating={averageRating} size="h-6 w-6" />
                <span className="ml-2 text-lg text-text-secondary">{averageRating.toFixed(1)} / 5</span>
              </div>
            )}
             {averageRating === 0 && <p className="mb-4 text-text-secondary">No ratings yet.</p>}

            <div className="space-y-1 text-sm text-text-secondary mb-4">
              {releaseDate && (
                <p className="flex items-center"><CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-400" /> Released: {format(new Date(releaseDate), 'MMMM d, yyyy')}</p>
              )}
              {genre && (
                <p className="flex items-center"><TicketIcon className="h-5 w-5 mr-2 text-slate-400" /> Genre: {genre}</p>
              )}
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">{description}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 pt-6 border-t border-border-color">
          <h3 className="text-2xl font-semibold text-text-primary mb-6">Reviews</h3>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} onEdit={handleEditReview} onDelete={handleDeleteReviewPrompt} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">No reviews yet for this movie.</p>
          )}
        </div>

        {/* Add/Edit Review Section */}
        {isAuthenticated && (
          <div id="add-review-section" className="mt-8 pt-6 border-t border-border-color">
            <h3 className="text-2xl font-semibold text-text-primary mb-4">
              {editingReview && editingReview._id ? 'Update Your Review' : 'Leave a Review'}
            </h3>
            <AddReviewForm
              onSubmitReview={handleReviewSubmit}
              existingReview={editingReview} // Pass userReview if it exists for pre-fill
              isLoading={loadingSubmitReview}
              error={submitReviewError}
            />
          </div>
        )}
        {!isAuthenticated && movie && (
             <div className="mt-8 pt-6 border-t border-border-color text-center">
                 <p className="text-text-secondary">Please <a href="/login" className="text-accent hover:underline">login</a> to leave a review.</p>
            </div>
        )}
      </>
    );
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title={movie?.title || "Movie Details"} size="3xl">
      {renderMovieContent()}
    </Modal>
    <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete your review? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  );
};

export default MovieModal;