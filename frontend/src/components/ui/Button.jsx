
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  disabled = false,
  isLoading = false,
  iconLeft,
  iconRight,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary transition-colors duration-150 ease-in-out";

  const variantStyles = {
    primary: `bg-accent hover:bg-accent-hover text-white focus:ring-accent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-slate-600 hover:bg-slate-500 text-text-primary focus:ring-slate-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-danger hover:bg-danger-hover text-white focus:ring-danger ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `text-accent hover:bg-slate-700 focus:ring-accent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading && !iconLeft && !iconRight ? loadingSpinner : (
        <>
          {iconLeft && !isLoading && <span className="mr-2 -ml-1">{iconLeft}</span>}
          {isLoading && iconLeft && <span className="mr-2 -ml-1">{loadingSpinner}</span>}
          {children}
          {iconRight && !isLoading && <span className="ml-2 -mr-1">{iconRight}</span>}
          {isLoading && iconRight && <span className="ml-2 -mr-1">{loadingSpinner}</span>}
        </>
      )}
    </button>
  );
};

export default Button;