import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

export default function UserReviews({ userId }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Fetch user reviews by ID
  useEffect(() => {
    console.log("User ID:", userId); // Add this to confirm the ID being used
    if (!userId) {
      console.error("No user ID provided.");
      
      return;
    }
  
    axios.get(`https://api.hachion.co/userreview/${userId}`)
      .then(response => {
        console.log("API Response:", response.data); // Log the response to confirm
        const reviewData = response.data;
        if (reviewData) {
          setReviews([{
            S_No: 1,
            name: reviewData.name,
            email: reviewData.email,
            course_name: reviewData.course_name,
            trainer_name: reviewData.trainer_name,
            social_id: reviewData.social_id,
            rating: Array(reviewData.rating).fill(<LiaStarSolid style={{ color: 'gold' }} />),
            review: reviewData.review,
            location: reviewData.location,
            date: reviewData.date,
          }]);
        } else {
          console.warn("No review data received.");
          setReviews([]);
        }
      })
      .catch(error => {
        console.error("Error fetching user reviews:", error);
      });
  }, [userId]);
  

  const handleAddReview = (userId, reviewData) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      {
        S_No: prevReviews.length + 1,
        course_name: reviewData.course_name,
        rating: Array(reviewData.rating).fill(<LiaStarSolid style={{ color: 'gold' }} />),
        review: reviewData.review,
      },
    ]);
  
    // Optionally, fetch updated reviews for the user
    axios.get(`https://api.hachion.co/userreview/${userId}`)
      .then(response => {
        console.log("Updated reviews fetched:", response.data);
        setReviews(response.data);
      })
      .catch(error => {
        console.error("Error fetching updated reviews:", error);
      });
  };
  

  const handleDeleteReview = (S_No) => {
    const reviewToDelete = reviews.find((review) => review.S_No === S_No);
    if (reviewToDelete) {
      axios.delete(`https://api.hachion.co/userreview/${reviewToDelete.review_id}`)
        .then(() => {
          setReviews((prevReviews) => prevReviews.filter((review) => review.S_No !== S_No));
        })
        .catch(error => {
          console.error("Error deleting review:", error);
        });
    }
  };

  return (
    <>
      <div className='courses-enrolled'>
        <nav className='dashboard-nav'>
          <div className='nav-content'>
            <div className='title'>{showReviewForm ? "Write a Review" : "User Reviews"}</div>
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
                    <TableCell align="center">Review</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((row) => (
                    <TableRow key={row.S_No}>
                      <TableCell align="center">{row.S_No}</TableCell>
                      <TableCell align="left">{row.course_name}</TableCell>
                      <TableCell align="center">{row.rating}</TableCell>
                      <TableCell align="left">{row.review}</TableCell>
                      <TableCell align="center">
                        <IconButton className="edit-button">
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
