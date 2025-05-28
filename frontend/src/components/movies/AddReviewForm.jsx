import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import StarRatingInput from '../ui/StarRatingInput'; // We'll create this next

const AddReviewForm = ({ onSubmitReview, existingReview, isLoading, error }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      rating: existingReview?.rating || 0,
      text: existingReview?.text || ''
    }
  });

  const currentRating = watch('rating');

  useEffect(() => {
    if (existingReview) {
      setValue('rating', existingReview.rating);
      setValue('text', existingReview.text);
    } else {
      setValue('rating', 0);
      setValue('text', '');
    }
  }, [existingReview, setValue]);

  const handleRatingChange = (newRating) => {
    setValue('rating', newRating, { shouldValidate: true });
  };

  const submitHandler = (data) => {
    if (data.rating === 0) {
        // Or handle this validation with react-hook-form's register
        alert("Please select a rating.");
        return;
    }
    onSubmitReview(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-text-primary mb-1">Your Rating</label>
        <StarRatingInput
            rating={currentRating}
            onRatingChange={handleRatingChange}
            maxRating={5}
            size="h-7 w-7" // Make stars larger for input
            color="text-yellow-400"
            hoverColor="text-yellow-300"
        />
        <input type="hidden" {...register("rating", { required: "Rating is required", min: { value: 1, message: "Rating must be at least 1" }})} />
        {errors.rating && <p className="error-message">{errors.rating.message}</p>}
      </div>

      <div>
        <label htmlFor="text" className="block text-sm font-medium text-text-primary">Your Review</label>
        <textarea
          id="text"
          {...register("text", { required: "Review text cannot be empty" })}
          rows="4"
          className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 shadow-sm focus:border-accent focus:ring-accent sm:text-sm text-text-primary p-3 placeholder-slate-400"
          placeholder={existingReview ? "Update your thoughts..." : "Share your thoughts on this movie..."}
        ></textarea>
        {errors.text && <p className="error-message">{errors.text.message}</p>}
      </div>

      {error && <p className="error-message text-center">{error}</p>}

      <div>
        <Button type="submit" isLoading={isLoading} className="w-full" disabled={isLoading}>
          {existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;