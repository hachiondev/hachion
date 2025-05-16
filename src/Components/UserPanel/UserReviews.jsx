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
    if (!userId) {
      console.error("No user ID provided.");
      return;
    }

    axios.get(`https://api.hachion.co/userreview/${userId}`)
      .then(response => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setReviews(response.data.map((review, index) => ({
            S_No: index + 1,
            review_id: review.review_id,
            course_name: review.course_name,
            rating: [...Array(review.rating)].map((_, i) => <LiaStarSolid key={i} style={{ color: 'gold' }} />),
            review: review.review,
          })));
        } else {
          setReviews([]);
          console.warn("Unexpected API response format.");
        }
      })
      .catch(error => {
        console.error("Error fetching user reviews:", error);
      });
  }, [userId]);

  // Handle adding a new review
  const handleAddReview = (reviewData) => {
    axios.post(`https://api.hachion.co/userreview`, {
      user_id: userId,
      course_name: reviewData.course_name,
      rating: reviewData.rating,
      review: reviewData.review,
    })
    .then(response => {
     alert("Review added successfully")
      fetchReviews();  // Refresh reviews after addition
      setShowReviewForm(false);
    })
    .catch(error => {
      console.error("Error adding review:", error);
    });
  };

  // Fetch updated reviews
  const fetchReviews = () => {
    axios.get(`https://api.hachion.co/userreview/${userId}`)
      .then(response => {
        console.log("Updated reviews fetched:", response.data);
        setReviews(response.data.map((review, index) => ({
          S_No: index + 1,
          review_id: review.review_id,
          course_name: review.course_name,
          rating: [...Array(review.rating)].map((_, i) => <LiaStarSolid key={i} style={{ color: 'gold' }} />),
          review: review.review,
        })));
      })
      .catch(error => {
        console.error("Error fetching updated reviews:", error);
      });
  };

  // Handle review deletion
  const handleDeleteReview = (reviewId) => {
    axios.delete(`https://api.hachion.co/userreview/${reviewId}`)
      .then(() => {
        console.log("Review deleted:", reviewId);
        fetchReviews(); // Refresh reviews after deletion
      })
      .catch(error => {
        console.error("Error deleting review:", error);
      });
  };

  return (
    <>
      <div className='courses-enrolled'>
        <nav className='dashboard-nav'>
          <div className='nav-content'>
            <div>{showReviewForm ? "Write a Review" : "User Reviews"}</div>
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
        <div style={{ flex: 1 }}>
          {showReviewForm ? (
            <UserWriteReview setShowReviewForm={setShowReviewForm} onSubmitReview={handleAddReview} />
          ) : (
            <div className="resume-div">
            <div className='resume-div-table'>
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
                        <IconButton onClick={() => handleDeleteReview(row.review_id)} className="delete-button">
                          <MdOutlineDeleteForever />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}