import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './Course.css';

const CardsPagination = ({ currentPage, totalCards, cardsPerPage, onPageChange }) => {
  // Instead of total pages, define the last "start index"
  const maxPage = Math.max(totalCards - cardsPerPage + 1, 1);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // move 1 card back
    }
  };

  const handleNext = () => {
    if (currentPage < maxPage) {
      onPageChange(currentPage + 1); // move 1 card forward
    }
  };

  const arrowsDisabled = totalCards <= cardsPerPage;

  return (
    <div className="cards-pagination">
      <button
        className="arrow"
        onClick={handlePrev}
        disabled={currentPage === 1 || arrowsDisabled}
        aria-label="Previous Card"
      >
        <IoIosArrowBack />
      </button>

      <button
        className="arrow"
        onClick={handleNext}
        disabled={currentPage === maxPage || arrowsDisabled}
        aria-label="Next Card"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default CardsPagination;
