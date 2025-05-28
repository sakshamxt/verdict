import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-15rem)] -mt-8"> {/* Adjust min-h and margin based on navbar/footer */}
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex justify-center">
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                    New Releases & Timeless Classics
                </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
              Welcome to <span className="text-accent">Verdict</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Discover, rate, and review your favorite movies. Join our community of film enthusiasts and share your cinematic journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/movies">
                <Button size="lg" variant="primary" iconLeft={<PlayCircleIcon className="h-6 w-6"/>}>
                  Explore Movies
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for Featured Movies or other sections */}
      {/*
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Featured Movies</h2>
          {/* Add MovieCard grid here if you fetch some featured movies */}
      {/* <p className="text-text-secondary text-center">Coming soon...</p>
        </div>
      </section>
      */}
    </div>
  );
};

export default HomePage;