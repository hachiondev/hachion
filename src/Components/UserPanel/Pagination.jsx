// import React from 'react';
// import {Link} from 'react-router-dom';
// import {IoIosArrowForward} from 'react-icons/io';
// import { MdArrowBackIos } from 'react-icons/md';


// const Pagination=()=>{

//     return(<>
//     <nav aria-label='Page navigation example'>
//         <ul className='pagination'>
//             <li className='page-item'><Link to='#' className='page-link'><MdArrowBackIos/></Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>1</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>2</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>3</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>4</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>5</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>6</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>7</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'>8</Link></li>
//             <li className='page-item'><Link to='#' className='page-link'><IoIosArrowForward/></Link></li>
//         </ul>
//     </nav>
//     </>)

// }

// export default Pagination;

// import React from 'react';
// import './Course.css';

// const Pagination = ({ currentPage, totalCards, cardsPerPage, onPageChange }) => {
//   const totalPages = Math.ceil(totalCards / cardsPerPage);
//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav className="pagination-nav">
//       <ul className="pagination">
//         {pageNumbers.map(number => (
//           <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
//             <button onClick={() => onPageChange(number)} className="page-link">
//               {number}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Pagination;

// import React from 'react';

// const Pagination = ({ currentPage, totalCards, cardsPerPage, onPageChange }) => {
//   const totalPages = Math.ceil(totalCards / cardsPerPage);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       onPageChange(newPage);
//     }
//   };

//   return (
//     <div className="pagination">
//       <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//         Previous
//       </button>
//       {[...Array(totalPages)].map((_, index) => (
//         <button
//           key={index}
//           onClick={() => handlePageChange(index + 1)}
//           className={currentPage === index + 1 ? 'active' : ''}
//         >
//           {index + 1}
//         </button>
//       ))}
//       <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;

import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import './Course.css';

const Pagination = ({ currentPage, totalCards, cardsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      // Prevent scrolling to the top
      // Instead, keep the current scroll position
      // window.scrollTo(0, window.scrollY); // Uncomment this if you want to maintain scroll position
    }
  };

  return (
    <div className="pagination">
      <button className="arrow"
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <IoIosArrowBack />
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button 
          key={index + 1} 
          onClick={() => handlePageChange(index + 1)} 
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      <button className="arrow"
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
