import { useState, useEffect, useCallback } from 'react';
import { adminGetAllMoviesApi, adminDeleteMovieApi, adminAddMovieApi, adminUpdateMovieApi } from '../../api/adminApi';
import Button from '../../components/ui/Button';
import AddEditMovieForm from '../../components/admin/AddEditMovieForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import StarRating from '../../components/ui/StarRating'; // To display average rating

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // null for add, movie object for edit
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminGetAllMoviesApi(); // Add pagination/search params if needed
      setMovies(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies.");
      console.error("Fetch movies error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormSubmitError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormSubmitError(null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingMovie(null);
    setFormSubmitError(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    setFormSubmitError(null);
    try {
      if (editingMovie && editingMovie._id) {
        await adminUpdateMovieApi(editingMovie._id, formData);
      } else {
        await adminAddMovieApi(formData);
      }
      handleCloseFormModal();
      fetchMovies(); // Refresh the list
    } catch (err) {
      setFormSubmitError(err.response?.data?.error || "An error occurred.");
      console.error("Form submit error:", err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    setIsDeleting(true);
    try {
      await adminDeleteMovieApi(movieToDelete._id);
      setIsConfirmModalOpen(false);
      setMovieToDelete(null);
      fetchMovies(); // Refresh list
    } catch (err) {
      console.error("Delete movie error:", err);
      // Optionally show an error message on the confirmation modal or a toast
      alert(err.response?.data?.error || "Failed to delete movie.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && movies.length === 0) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Manage Movies</h1>
        <Button onClick={handleOpenAddModal} iconLeft={<PlusIcon className="h-5 w-5" />}>
          Add New Movie
        </Button>
      </div>

      {movies.length === 0 && !isLoading ? (
        <p className="text-text-secondary text-center py-10">No movies found. Add one to get started!</p>
      ) : (
        <div className="bg-secondary shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Poster</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Genre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Release Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Avg. Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-secondary divide-y divide-slate-700">
              {movies.map((movie) => (
                <tr key={movie._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={movie.posterUrl || 'https://via.placeholder.com/40x60.png?text=N/A'} alt={movie.title} className="h-16 w-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">{movie.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{movie.genre || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {movie.releaseDate ? format(new Date(movie.releaseDate), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {movie.averageRating > 0 ? (
                        <StarRating rating={movie.averageRating} size="h-4 w-4" />
                    ) : (
                        <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(movie)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5 text-slate-400 hover:text-accent" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(movie)} title="Delete">
                      <TrashIcon className="h-5 w-5 text-slate-400 hover:text-danger" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormModalOpen && (
        <AddEditMovieForm
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          initialData={editingMovie}
          isLoading={isSubmittingForm}
          error={formSubmitError}
        />
      )}

      {isConfirmModalOpen && movieToDelete && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete Movie: ${movieToDelete.title}`}
          message="Are you sure you want to delete this movie? All associated reviews will also be deleted. This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminMoviesPage;