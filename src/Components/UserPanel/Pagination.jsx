import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "./Course.css";

const Pagination = ({
  currentPage,
  totalCards,
  cardsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      // Prevent scrolling to the top
      // Instead, keep the current scroll position
      // window.scrollTo(0, window.scrollY); // Uncomment this if you want to maintain scroll position
    }
  };

  console.log(totalCards);
  // console.log(cardsPerPage);
  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-number ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    // console.log(pageNumbers);
    return pageNumbers;
  };

  return (
    <div className="course-pagination">
      <button
        className="arrow"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>
      {/* {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>
      ))} */}
      {renderPageNumbers()}
      <button
        className="arrow"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
