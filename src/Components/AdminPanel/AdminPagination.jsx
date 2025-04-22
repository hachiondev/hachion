import React from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';

const Pagination = ({ currentPage, rowsPerPage, totalRows, onPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (totalRows <= rowsPerPage) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
       <MdKeyboardArrowLeft style={{fontSize: '24px'}}/>
      </button>
      {renderPageNumbers()}
      <button
        className="pagination-arrow"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
       <MdKeyboardArrowRight style={{fontSize: '24px'}}/>
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

export default Pagination;