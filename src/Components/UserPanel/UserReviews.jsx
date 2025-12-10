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
import { MdOutlineDeleteForever } from "react-icons/md";
import './Dashboard.css';

export default function UserReviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loginuserData")) || {};

    const emailFromStorage =
      storedUser.email ||
      storedUser.student_email ||
      storedUser.emailid ||
      storedUser.username ||
      "";

    if (!emailFromStorage) {
      console.warn("No email found in loginuserData");
    }

    setUserEmail(emailFromStorage);
  }, []);

  
  const fetchReviews = async (emailToUse = userEmail) => {
    try {
      if (!emailToUse) {
        console.warn("fetchReviews called without email");
        return;
      }

      const url = `https://api.hachion.co/userreview/email/${encodeURIComponent(
        emailToUse
      )}`;

      const response = await axios.get(url);
      const data = response.data;

      if (Array.isArray(data)) {
        setReviews(
  data.map((review, index) => ({
    S_No: index + 1,
    review_id: review.review_id,
    course_name: review.course_name,
    rating: [...Array(review.rating || 0)].map((_, i) => (
      <LiaStarSolid key={i} style={{ color: 'gold' }} />
    )),
    review: review.review,
    
    status: review.status,
  }))
);

        setErrorMessage("");
      } else {
        setReviews([]);
        setErrorMessage("Unexpected API response. Please contact support.");
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      setErrorMessage("Could not fetch reviews. Please try again later.");
    }
  };


  useEffect(() => {
    if (userEmail) {
      fetchReviews(userEmail);
    }
  }, [userEmail]);

  
  const handleAddReview = () => {
    setSuccessMessage("Review added successfully!");
    setErrorMessage("");
    fetchReviews();

    setShowReviewForm(false);

    setTimeout(() => setSuccessMessage(""), 2000);
  };

const handleDeleteReview = (reviewId) => {
  const confirmed = window.confirm("Are you sure you want to delete this review?");
  if (!confirmed) return;

  axios
    .delete(`https://api.hachion.co/userreview/delete/${reviewId}`)
    .then(() => {
      console.log("Review deleted:", reviewId);
      fetchReviews();
      setSuccessMessage("Review deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    })
    .catch((error) => {
      console.error("Error deleting review:", error);
      setErrorMessage("Failed to delete review. Please try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    });
};


  return (
    <>
      <div className='courses-enrolled'>
        <nav className='dashboard-nav'>
          <div className='nav-content'>
            <div>{showReviewForm ? "Write a Review" : "User Reviews"}</div>
            {!showReviewForm && (
              <button
                className='write-btn'
                onClick={() => setShowReviewForm(true)}
              >
                Write Review
              </button>
            )}
          </div>
        </nav>
      </div>

      {showReviewForm && (
        <nav aria-label="breadcrumb" className='breadcrumb-nav'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#!" onClick={() => setShowReviewForm(false)}>
                Reviews
              </a>{" "}
              <MdKeyboardArrowRight />
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
            <UserWriteReview
              setShowReviewForm={setShowReviewForm}
              onSubmitReview={handleAddReview} 
            />
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
                        <TableCell align="center" style={{ width: '30px' }}>
                          S.No.
                        </TableCell>
                        <TableCell align="center" style={{ maxWidth: '200px' }}>Course Name</TableCell>
                        <TableCell align="center">Rating</TableCell>
                        <TableCell align="center">Review</TableCell>
                        <TableCell align="center" style={{ width: '50px' }}>
                          Actions
                        </TableCell>
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
                            <TableCell align="left" style={{ whiteSpace: 'pre-wrap' }}>{row.course_name}</TableCell>
                            <TableCell align="center">{row.rating}</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'pre-wrap' }}>{row.review}</TableCell>
                           <TableCell align="center">
  {row.status === null || row.status === "" ? (
    
    <IconButton
      onClick={() => handleDeleteReview(row.review_id)}
      className="delete-button"
    >
      <MdOutlineDeleteForever />
    </IconButton>
  ) : row.status.toLowerCase() === "approved" ? (
    
    <span
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "5px 12px",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "13px",
        display: "inline-block",
      }}
    >
      Approved
    </span>
  ) : row.status.toLowerCase() === "rejected" ? (
    
    <span
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "5px 12px",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "13px",
        display: "inline-block",
      }}
    >
      Rejected
    </span>
  ) : (
    
    <span>{row.status}</span>
  )}
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
