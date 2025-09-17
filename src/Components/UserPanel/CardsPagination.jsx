import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './Course.css';

const CardsPagination = ({ currentPage, totalCards, cardsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const arrowsDisabled = totalCards <= cardsPerPage;

  return (
    <div className="cards-pagination">
      <button
        className="arrow"
        onClick={handlePrev}
        disabled={currentPage === 1 || arrowsDisabled}
      >
        <IoIosArrowBack />
      </button>

      <button
        className="arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages || arrowsDisabled}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default CardsPagination;
