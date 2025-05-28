import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Modal from '../ui/Modal'; // Using the generic modal
import { format } from 'date-fns'; // For formatting date for input type="date"

const AddEditMovieForm = ({ isOpen, onClose, onSubmit, initialData, isLoading, error }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      posterUrl: '',
      releaseDate: '',
      genre: ''
    }
  });

  const isEditing = !!initialData?._id;

  useEffect(() => {
    if (initialData) {
      // Format date for input type="date" which expects "yyyy-MM-dd"
      const formattedData = {
        ...initialData,
        releaseDate: initialData.releaseDate ? format(new Date(initialData.releaseDate), 'yyyy-MM-dd') : ''
      };
      reset(formattedData);
    } else {
      reset({ title: '', description: '', posterUrl: '', releaseDate: '', genre: '' });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    // Convert releaseDate back to ISO string or Date object if necessary before sending to backend
    // For now, assuming backend handles "yyyy-MM-dd" string if that's what it gets.
    // If it needs ISO: data.releaseDate = new Date(data.releaseDate).toISOString();
    onSubmit(data);
  };

  const commonInputClasses = "mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-accent focus:ring-accent sm:text-sm text-text-primary p-3 placeholder-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Movie' : 'Add New Movie'} size="xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && <p className="error-message text-center bg-red-500/10 p-3 rounded-md">{error}</p>}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-primary">Title</label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className={`${commonInputClasses} ${errors.title ? 'border-red-500' : 'border-slate-600'}`}
          />
          {errors.title && <p className="error-message">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
          <textarea
            id="description"
            rows="4"
            {...register("description", { required: "Description is required" })}
            className={`${commonInputClasses} ${errors.description ? 'border-red-500' : 'border-slate-600'}`}
          ></textarea>
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-text-primary">Poster URL</label>
          <input
            type="url"
            id="posterUrl"
            {...register("posterUrl", {
              required: "Poster URL is required",
              pattern: { value: /^(ftp|http|https):\/\/[^ "]+$/, message: "Enter a valid URL" }
            })}
            className={`${commonInputClasses} ${errors.posterUrl ? 'border-red-500' : 'border-slate-600'}`}
          />
          {errors.posterUrl && <p className="error-message">{errors.posterUrl.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-text-primary">Release Date</label>
            <input
                type="date"
                id="releaseDate"
                {...register("releaseDate")}
                className={`${commonInputClasses} ${errors.releaseDate ? 'border-red-500' : 'border-slate-600'}`}
            />
            {errors.releaseDate && <p className="error-message">{errors.releaseDate.message}</p>}
            </div>

            <div>
            <label htmlFor="genre" className="block text-sm font-medium text-text-primary">Genre</label>
            <input
                type="text"
                id="genre"
                {...register("genre")}
                className={`${commonInputClasses} ${errors.genre ? 'border-red-500' : 'border-slate-600'}`}
                placeholder="e.g., Action, Comedy, Sci-Fi"
            />
            {errors.genre && <p className="error-message">{errors.genre.message}</p>}
            </div>
        </div>


        <div className="pt-2 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {isEditing ? 'Save Changes' : 'Add Movie'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditMovieForm;