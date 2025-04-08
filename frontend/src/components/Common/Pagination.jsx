import React from 'react';
import Button from './Button'; // Assuming Button component exists
import clsx from 'clsx';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers (can be enhanced with ellipsis for many pages)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      {/* Left side (info) - Optional */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-start">
         <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>

      {/* Right side (buttons) */}
      <div className="flex flex-1 justify-between sm:justify-end items-center space-x-2">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="secondary"
          size="sm"
        >
          Previous
        </Button>
        {/* Simple page number display - can be enhanced */}
         {/* <div className="hidden sm:flex space-x-1">
            {pageNumbers.map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={clsx(
                'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
                currentPage === page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                )}
            >
                {page}
            </button>
            ))}
        </div> */}
         <span className="text-sm text-gray-700 sm:hidden">
            Page {currentPage} of {totalPages}
         </span>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="secondary"
          size="sm"
        >
          Next
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;