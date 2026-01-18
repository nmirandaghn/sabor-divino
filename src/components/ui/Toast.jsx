import { useEffect } from 'react';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {'success' | 'error'} props.type - The type of toast
 * @param {Function} props.onClose - Callback when toast is closed
 * @param {number} [props.duration=5000] - Duration in ms before auto-close
 */
export default function Toast({ message, type = 'success', onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const baseClasses =
    'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-md';
  const typeClasses =
    type === 'success'
      ? 'bg-accent-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {/* Icon */}
      <span className="flex-shrink-0">
        {type === 'success' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </span>
      {/* Message */}
      <p className="text-sm font-medium">{message}</p>
      {/* Close button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
