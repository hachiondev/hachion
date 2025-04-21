import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import './Admin.css';
const Pagination = ({ currentPage, rowsPerPage, totalRows, onPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  if (totalRows <= rowsPerPage) return null;
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <button
          key={page}
          className={`pagination-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      );
    });
  };
  return (
    <div className='pagination'>
      <button
        className='pagination-arrow'
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='Previous page'
      >
        <MdKeyboardArrowLeft className='pagination-icon' />
      </button>
      {renderPageNumbers()}
      <button
        className='pagination-arrow'
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='Next page'
      >
        <MdKeyboardArrowRight className='pagination-icon' />
      </button>
    </div>
  );
};
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
export default memo(Pagination);