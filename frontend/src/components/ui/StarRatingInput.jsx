import { useState } from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const StarRatingInput = ({ rating, onRatingChange, maxRating = 5, size = 'h-6 w-6', color = 'text-yellow-400', hoverColor = 'text-yellow-300' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index) => {
    onRatingChange(index);
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || rating);
        return (
          <button
            type="button" // Important for forms
            key={starValue}
            className={`focus:outline-none transition-colors duration-150 ${isFilled ? hoverColor : color}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            {isFilled ? (
              <StarSolid className={`${size}`} />
            ) : (
              <StarOutline className={`${size}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;