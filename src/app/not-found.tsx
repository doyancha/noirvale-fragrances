import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-[#0a0a0a] text-[#faf7f4] min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4 max-w-lg mx-auto">
        <h1 className="text-9xl font-serif text-[#c9a96e] opacity-50 mb-4">404</h1>
        <h2 className="text-3xl font-serif mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-10">
          The fragrance or page you are looking for seems to have evaporated. Let&apos;s get you back to discovering exceptional scents.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#c9a96e] text-black px-6 py-3 rounded-md font-medium hover:bg-[#d4b782] transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/shop"
            className="border border-[#c9a96e] text-[#c9a96e] px-6 py-3 rounded-md font-medium hover:bg-[#c9a96e]/10 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}