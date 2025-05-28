import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { ArrowRightCircleIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // Redirect to previous page or home

  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data) => {
    setIsLoading(true);
    const success = await login(data);
    setIsLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-secondary p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to Verdict
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
              {authError}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${errors.email ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
            <div className="pt-4"> {/* Added padding top for spacing */}
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border ${errors.password ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                  placeholder="Password"
                />
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent-hover">
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center"
              isLoading={isLoading || authLoading}
              disabled={isLoading || authLoading}
              iconLeft={!isLoading && !authLoading ? <ArrowRightCircleIcon className="h-5 w-5" /> : null}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;