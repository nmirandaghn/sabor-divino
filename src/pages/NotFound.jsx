import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-800">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mt-2 text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
