import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { IoSearch } from "react-icons/io5";
import { FaCheckCircle } from 'react-icons/fa';
import { RiCloseCircleLine } from 'react-icons/ri';
import axios from 'axios';
import AdminPagination from './AdminPagination';
import dayjs from 'dayjs';
import './Admin.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function StudentReview() {
  const [review, setReview] = useState([]);
  const [filteredReview, setFilteredReview] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchReview = async () => {
        try {
            const response = await axios.get('https://api.test.hachion.co/userreview');
            const filteredReviews = response.data.filter(review => review.type === false);
            setReview(filteredReviews);
            setFilteredReview(filteredReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error.message);
        }
    };

    fetchReview();
}, []);


  useEffect(() => {
    const filtered = review.filter(r =>
      r.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.social_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReview(filtered);
  }, [searchTerm, review]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedReviews = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleApprove = async (review_id) => {
    try {
        // Find the review to update
        const reviewToUpdate = review.find((item) => item.review_id === review_id);
        
        if (!reviewToUpdate) return;

        // Create a new object with type changed to true
        const updatedReview = { ...reviewToUpdate, type: true, status: 'approved' };

        // Create FormData for API request (since the API expects multipart/form-data)
        const formData = new FormData();
        formData.append("review", JSON.stringify(updatedReview)); // Send review data as JSON string

        // Send update request to backend
        const response = await axios.put(`https://api.test.hachion.co/userreview/update/${review_id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (response.status === 200) {
            // Update state after successful API call
            const updatedReviews = review.map((item) =>
                item.review_id === review_id ? updatedReview : item
            );
            setReview(updatedReviews);
            setFilteredReview(updatedReviews);
            console.log("Review approved and updated in backend successfully!");
        }
    } catch (error) {
        console.error("Error updating review:", error.message);
    }
};

//   const handleApprove = (review_id) => {
//     const updatedReviews = review.map((item) =>
//       item.review_id === review_id 
//         ? { ...item, status: 'approved', type: true }  // Set type to true on approval
//         : item
//     );
//     setReview(updatedReviews);
//     setFilteredReview(updatedReviews);
// };

const handleReject = async (review_id) => {
  try {
    const reviewToUpdate = review.find((item) => item.review_id === review_id);
    if (!reviewToUpdate) return;

    const updatedReview = { ...reviewToUpdate, status: 'rejected' };

    const formData = new FormData();
    formData.append("review", JSON.stringify(updatedReview));

    const response = await axios.put(`https://api.test.hachion.co/userreview/update/${review_id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (response.status === 200) {
      const updatedReviews = review.map((item) =>
        item.review_id === review_id ? updatedReview : item
      );
      setReview(updatedReviews);
      setFilteredReview(updatedReviews);
      console.log("Review rejected and updated in backend successfully!");
    }
  } catch (error) {
    console.error("Error rejecting review:", error.message);
  }
};
  return (
    <>
      <div className='course-category'>
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>View Student Reviews</p>
          </div>
          <div className='entries'>
            <div className='entries-left'>
              <p style={{ marginBottom: '0' }}>Show</p>
              <div className="btn-group">
                <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown">
                  {rowsPerPage}
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(10)}>10</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(25)}>25</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(50)}>50</a></li>
                </ul>
              </div>
              <p style={{ marginBottom: '0' }}>entries</p>
            </div>
            <div className='entries-right'>
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
                    value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}/>
                   <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
                 </div>
            </div>
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='center' sx={{ width: '100px' }}><Checkbox /></StyledTableCell>
              <StyledTableCell align='center'>S.No.</StyledTableCell>
              <StyledTableCell align='center'>Image</StyledTableCell>
              <StyledTableCell align='center'>Student Name</StyledTableCell>
              <StyledTableCell align="center">Source</StyledTableCell>
              <StyledTableCell align="center">Technology</StyledTableCell>
              <StyledTableCell align="center">Comment</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center" sx={{ width: '150px' }}>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedReviews.length > 0 ? (
              displayedReviews.map((review, index) => (
                <StyledTableRow key={review.review_id}>
                  <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                  <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                  <StyledTableCell align="center">
                    {review.user_image ? <img src={review.user_image} alt="User" width="50" height="50"/> : 'No Image'}
                  </StyledTableCell>
                  <StyledTableCell align="left">{review.name}</StyledTableCell>
                  <StyledTableCell align="center">{review.social_id}</StyledTableCell>
                  <StyledTableCell align="left">{review.course_name}</StyledTableCell>
                  <StyledTableCell align="left" style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
                    {review.review}
                  </StyledTableCell>
                  <StyledTableCell align="left">{review.date
                                                 ? dayjs(review.date).format("MM-DD-YYYY")
                                                 : "N/A"}</StyledTableCell>
                  <StyledTableCell align="center">
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  {review.status === 'approved' ? (
                      <span className="approved">Approved</span>
                    ) : review.status === 'rejected' ? (
                      <span className="rejected">Rejected</span>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <FaCheckCircle
                          className="approve"
                          onClick={() => handleApprove(review.review_id)}
                        />
                        <RiCloseCircleLine
                          className="reject"
                          onClick={() => handleReject(review.review_id)}
                        />
                      </div>
                    )}
                  </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow><StyledTableCell colSpan={8} align="center">No Data Available</StyledTableCell></StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination-container'>
        <AdminPagination currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={filteredReview.length} onPageChange={handlePageChange} />
      </div>
    </>
  );
}