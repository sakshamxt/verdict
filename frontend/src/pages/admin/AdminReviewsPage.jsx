import { useState, useEffect, useCallback } from 'react';
import { adminGetAllReviewsApi, adminDeleteReviewApi } from '../../api/adminApi';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StarRating from '../../components/ui/StarRating';
import { TrashIcon, FilmIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminGetAllReviewsApi();
      // Assuming backend populates user (name) and movie (title)
      setReviews(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch reviews.");
      console.error("Fetch reviews error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      await adminDeleteReviewApi(reviewToDelete._id);
      setIsConfirmModalOpen(false);
      setReviewToDelete(null);
      fetchReviews(); // Refresh list
    } catch (err) {
      console.error("Delete review error:", err);
      alert(err.response?.data?.error || "Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && reviews.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Manage All Reviews</h1>

      {reviews.length === 0 && !isLoading ? (
        <p className="text-text-secondary text-center py-10">No reviews found across the platform.</p>
      ) : (
        <div className="bg-secondary shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Movie</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Review Text (Excerpt)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-slate-700">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <FilmIcon className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0"/>
                        <span className="text-sm font-medium text-text-primary truncate max-w-xs" title={review.movie?.title || 'Unknown Movie'}>
                            {review.movie?.title || 'Unknown Movie'}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0"/>
                        <span className="text-sm text-text-secondary">{review.user?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={review.rating} size="h-4 w-4" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-secondary truncate max-w-md" title={review.text}>
                      {review.text}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(review)} title="Delete Review">
                      <TrashIcon className="h-5 w-5 text-slate-400 hover:text-danger" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isConfirmModalOpen && reviewToDelete && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Review"
          message={`Are you sure you want to delete this review? Reviewer: ${reviewToDelete.user?.name || 'N/A'}, Movie: ${reviewToDelete.movie?.title || 'N/A'}. This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminReviewsPage;