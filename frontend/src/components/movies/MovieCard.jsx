import StarRating from '../ui/StarRating'; // Assuming you have this
import { TicketIcon } from '@heroicons/react/24/solid'; // Example icon

const MovieCard = ({ movie, onClick }) => {
  if (!movie) return null;

  const { title, posterUrl, averageRating } = movie;

  return (
    <div
      className="bg-secondary rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] w-full">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if placeholder also fails
              e.target.src = 'https://via.placeholder.com/400x600.png?text=No+Image'; // Placeholder
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <TicketIcon className="w-16 h-16 text-slate-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary truncate" title={title}>
          {title || 'Untitled Movie'}
        </h3>
        {averageRating > 0 && (
          <div className="mt-2 flex items-center">
            <StarRating rating={averageRating} size="h-4 w-4" />
            <span className="ml-2 text-xs text-text-secondary">{averageRating.toFixed(1)}</span>
          </div>
        )}
         {averageRating === 0 && (
          <div className="mt-2">
             <p className="text-xs text-slate-500">No ratings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;