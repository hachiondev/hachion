import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import './Course.css';

const Pagination = ({ currentPage, cardsPerPage, totalCards, onPageChange }) => {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  if (totalPages <= 1) return null; // Hide pagination if only 1 page

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const siblingCount = 1;

    const shouldShowLeftDots = currentPage > siblingCount + 2;
    const shouldShowRightDots = currentPage < totalPages - (siblingCount + 1);

    const startPages = [1];
    const endPages = [totalPages];

    const middlePages = [];
    for (
      let i = Math.max(2, currentPage - siblingCount);
      i <= Math.min(totalPages - 1, currentPage + siblingCount);
      i++
    ) {
      middlePages.push(i);
    }

    const allPages = [
      ...startPages,
      ...(shouldShowLeftDots ? ['...'] : []),
      ...middlePages,
      ...(shouldShowRightDots ? ['...'] : []),
      ...endPages,
    ];

    return allPages.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`dots-${index}`} className="pagination-dots">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          className={`pagination-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="user-pagination">
      <button
        className="user-pagination-arrow"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <MdKeyboardArrowLeft className="user-pagination-icon" />
      </button>

      {renderPageNumbers()}

      <button
        className="user-pagination-arrow"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <MdKeyboardArrowRight className="user-pagination-icon" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  cardsPerPage: PropTypes.number.isRequired,
  totalCards: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default memo(Pagination);
