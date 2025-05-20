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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user reviews by ID
  useEffect(() => {
    if (!userId) {
      console.error("No user ID provided.");
      return;
    }

    axios.get(`https://api.test.hachion.co/userreview/${userId}`)
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
const handleAddReview = async (reviewData) => {
  try {
    const response = await axios.post(`https://api.test.hachion.co/userreview`, {
      user_id: userId,
      ...reviewData
    });

    if (response.status === 200 || response.status === 201) {
      setSuccessMessage("Review added successfully!");
      setErrorMessage("");

      // Wait for backend to process before fetching
      await new Promise(resolve => setTimeout(resolve, 1500));

      await fetchReviews(); // Await to ensure it's completed
      setShowReviewForm(false);

      // Clear message after short delay
      setTimeout(() => setSuccessMessage(""), 2000);
    } else {
      setErrorMessage("Failed to add review. Please try again.");
    }
  } catch (error) {
    console.error("Error adding review:", error);
    setErrorMessage("Failed to add review. Please try again.");
    setSuccessMessage("");
  }
};

  // Fetch updated reviews
  const fetchReviews = async () => {
  try {
    const response = await axios.get(`https://api.test.hachion.co/userreview/${userId}`);
    const data = response.data;

    if (Array.isArray(data)) {
      setReviews(data.map((review, index) => ({
        S_No: index + 1,
        review_id: review.review_id,
        course_name: review.course_name,
        rating: [...Array(review.rating)].map((_, i) => <LiaStarSolid key={i} style={{ color: 'gold' }} />),
        review: review.review,
      })));
    } else {
      setReviews([]);
      setErrorMessage("Unexpected API response. Please contact support.");
    }
  } catch (error) {
    console.error("Error fetching updated reviews:", error);
    setErrorMessage("Could not fetch reviews. Please try again later.");
  }
};

  // Handle review deletion
  const handleDeleteReview = (reviewId) => {
    axios.delete(`https://api.test.hachion.co/userreview/${reviewId}`)
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
              {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
            <div className='resume-div-table'>
            <TableContainer component={Paper}>
              <Table className='resume-table' aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{width: '50px'}}>S.No.</TableCell>
                    <TableCell align="center">Course Name</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Review</TableCell>
                    <TableCell align="center" style={{width: '70px'}}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No reviews found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviews.map((row) => (
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
                  ))
                )}
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