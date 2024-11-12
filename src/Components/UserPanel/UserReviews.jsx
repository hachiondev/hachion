import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { LiaStarSolid } from "react-icons/lia";
import UserWriteReview from './UserWriteReview';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { BiSolidEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";
import './Dashboard.css';

function createData(S_No, course_name, Rating, Reviews) {
  return { S_No, course_name, Rating, Reviews };
}

export default function UserReviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    createData(1, 'QA Automation', Array(5).fill(<LiaStarSolid style={{ color: 'gold' }} />), 'I found the correct platform for online training.'),
    createData(2, 'Python', Array(4).fill(<LiaStarSolid style={{ color: 'gold' }} />), 'Industry exposure live projects intensified my practical skills.')
  ]);

  const handleAddReview = (rating, reviewText, courseName) => {
    const newReview = createData(
      reviews.length + 1,
      courseName, 
      Array(rating).fill(<LiaStarSolid style={{ color: 'gold' }} />),  // Generate stars based on rating
      reviewText
    );
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const handleDeleteReview = (S_No) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.S_No !== S_No));
  };

  const handleEditReview = (S_No) => {
    console.log('Edit review with S_No:', S_No);
    setShowReviewForm(true);
  };

  return (
    <>
      <div className='courses-enrolled'>
        <nav className='dashboard-nav'>
          <div className='nav-content'>
            <div className='title'>{showReviewForm ? "Write a Review" : "Reviews"}</div>
            {!showReviewForm && (
              <button className='write-btn' onClick={() => setShowReviewForm(true)}>Write Review</button>
            )}
          </div>
        </nav>
      </div>

      {showReviewForm && (
        <nav aria-label="breadcrumb" className='breadcrumb-nav'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#!" onClick={() => setShowReviewForm(false)}>Reviews</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Write a Review
            </li>
          </ol>
        </nav>
      )}

      <div className='content-wrapper' style={{ display: 'flex', flexDirection: 'row' }}>
        <div className='resume-div' style={{ flex: 1 }}>
          {showReviewForm ? (
            <UserWriteReview setShowReviewForm={setShowReviewForm} onSubmitReview={handleAddReview} />
          ) : (
            <TableContainer component={Paper}>
              <Table className='resume-table' aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S.No.</TableCell>
                    <TableCell align="center">Course Name</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Reviews</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((row) => (
                    <TableRow key={row.S_No}>
                      <TableCell align="center">{row.S_No}</TableCell>
                      <TableCell align="left">{row.course_name}</TableCell>
                      <TableCell align="center">{row.Rating}</TableCell>
                      <TableCell align="left">{row.Reviews}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditReview(row.S_No)} className="edit-button">
                          <BiSolidEditAlt />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteReview(row.S_No)} className="delete-button">
                          <MdOutlineDeleteForever />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
}
