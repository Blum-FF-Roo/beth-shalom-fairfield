import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-bold mb-4" style={{color: '#F58C28'}}>
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-200"
          style={{backgroundColor: '#F58C28'}}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
