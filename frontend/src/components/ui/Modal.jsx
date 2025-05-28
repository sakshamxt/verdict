import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4 sm:mx-auto'
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-[60] p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div
        className={`bg-secondary rounded-lg shadow-xl p-6 m-4 relative custom-scrollbar overflow-y-auto max-h-[90vh] ${sizeClasses[size] || sizeClasses.md} w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div className="flex justify-between items-center pb-3 border-b border-border-color mb-4">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-accent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
      <style jsx global>{`
        @keyframes modal-appear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;