'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4 max-w-lg mx-auto">
        <h2 className="text-3xl font-serif mb-6 text-[#c9a96e]">Something went wrong</h2>
        <p className="text-gray-400 mb-10">
          We apologize for the inconvenience. An unexpected error has occurred while trying to process your request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-[#c9a96e] text-black px-6 py-3 rounded-md font-medium hover:bg-[#d4b782] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#c9a96e] text-[#c9a96e] px-6 py-3 rounded-md font-medium hover:bg-[#c9a96e]/10 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}