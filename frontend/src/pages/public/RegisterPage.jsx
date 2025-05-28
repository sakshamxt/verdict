import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { UserPlusIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const { register: registerFormField, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, error: authError, loading: authLoading, setAuthError } = useAuth(); // Renamed register to registerUser to avoid conflict
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null); // Clear previous errors
    const { name, email, password } = data;
    const success = await registerUser({ name, email, password });
    setIsLoading(false);
    if (success) {
      // Consider auto-login or navigate to login page with a success message
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-secondary p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Create your Verdict account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
              Sign in
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
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  {...registerFormField("name", { required: "Name is required" })}
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border ${errors.name ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                  placeholder="Full name"
                />
              </div>
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="pt-4">
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
                  {...registerFormField("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.email ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm ${errors.name ? '' : 'rounded-t-md'} ${errors.password ? '' : 'rounded-b-md'}`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="pt-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  {...registerFormField("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${errors.password ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                  placeholder="Password"
                />
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

             {/* Confirm Password Field */}
             <div className="pt-4">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerFormField("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600'} bg-slate-700 placeholder-slate-400 text-text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm`}
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center"
              isLoading={isLoading || authLoading}
              disabled={isLoading || authLoading}
              iconLeft={!isLoading && !authLoading ? <UserPlusIcon className="h-5 w-5" /> : null}
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;