// Pagination component for blog posts.
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., '/blog'
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
  const router = useRouter();

  const getPageLink = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/page/${page}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={getPageLink(currentPage - 1)}
          className="p-2 rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageLink(page)}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
            ${page === currentPage
              ? 'bg-primary-light text-white dark:bg-primary-dark'
              : 'bg-gray-200 text-text-light dark:bg-gray-700 dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageLink(currentPage + 1)}
          className="p-2 rounded-md text-text-light dark:text-text-dark bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;