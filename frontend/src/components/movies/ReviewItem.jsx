import React from 'react';
import StarRating from '../ui/StarRating';
import { UserCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns'; // For date formatting
import useAuth from '../../hooks/useAuth'; // To check if the logged-in user is the review author

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user: loggedInUser } = useAuth();
  if (!review || !review.user) return null;

  const isAuthor = loggedInUser && loggedInUser._id === review.user._id;

  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow mb-4">
      <div className="flex items-start space-x-3">
        <UserCircleIcon className="h-10 w-10 text-slate-400 mt-1" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-text-primary">{review.user.name || 'Anonymous'}</h4>
            {isAuthor && (
              <div className="flex space-x-2">
                <button onClick={() => onEdit(review)} className="text-slate-400 hover:text-accent transition-colors" title="Edit review">
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(review._id)} className="text-slate-400 hover:text-danger transition-colors" title="Delete review">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="my-1">
            <StarRating rating={review.rating} size="h-4 w-4" />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed break-words">
            {review.text}
          </p>
          <p className="text-xs text-slate-500 mt-2 text-right">
            {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : 'Unknown date'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;