import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <Link href="/" className="text-blue-500">
          Go back home
        </Link>
      </div>
    </div>
  );
}
