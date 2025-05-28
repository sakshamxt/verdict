import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const StarRating = ({ rating, maxRating = 5, onRatingChange, size = 'h-5 w-5', color = 'text-yellow-400', interactive = false }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Not implementing half stars for simplicity here, but could be added
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarSolid
          key={`full-${i}`}
          className={`${size} ${color}`}
          onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
        />
      ))}
      {/* Placeholder for half star rendering if implemented */}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <StarOutline
          key={`empty-${i}`}
          className={`${size} ${color}`}
          onClick={() => interactive && onRatingChange && onRatingChange(fullStars + i + 1)}
        />
      ))}
      {/* Display numerical rating alongside stars if not interactive or desired */}
      {/* {!interactive && <span className="ml-2 text-sm text-text-secondary">{rating.toFixed(1)}</span>} */}
    </div>
  );
};

export default StarRating;