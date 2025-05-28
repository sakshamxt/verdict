import { Link } from 'react-router-dom';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4"> {/* Adjust min-h based on navbar/footer height */}
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-text-primary mb-6">Page Not Found</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
      >
        <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;