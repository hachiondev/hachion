import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import './Dashboard.css';

const UserWriteReview = ({ setShowReviewForm, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [courseName, setCourseName] = useState('');  // Store selected course

  const handleSubmit = () => {
    console.log("Submitting Review:");
    console.log("Rating:", rating);
    console.log("Review Text:", reviewText);
    console.log("Course Name:", courseName);

    onSubmitReview(rating, reviewText, courseName); // Pass courseName to the parent
    setShowReviewForm(false); 
  };

  return (
    <div className='write-review'>
      <div className='review-form-content'>
        <div className="input-row">
          <div className="col-md-5">
            <label className='form-label'>Name</label>
            <input type="text" className="form-control" placeholder="Enter your Name" aria-label="Name" />
          </div>
         
          <div className="col-md-5">
            <label className='form-label'>Email</label>
            <input type="email" className="form-control" placeholder="abc@gmail.com" aria-label="Email" />
          </div>
        </div>

        <div className="input-row">
        <div className="col-md-5">
            <label className='form-label'>Location</label>
            <input type="text" className="form-control" placeholder="Enter your Location" aria-label="Location" />
          </div>
          <div className="col-md-5">
            <label className="form-label">Review Type</label>
            <select className="form-select">
              <option>Select Type</option>
              <option>Course Review</option>
              <option>Trainer Review</option>
            </select>
          </div>
        </div>

        <div className="input-row">
        <div className="col-md-5">
            <label className="form-label">Course Name</label>
            <select
              className="form-select"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}  // Update course selection
            >
              <option>Select Course</option>
              <option>QA Automation</option>
              <option>Load Runner</option>
              <option>QA Manual Testing</option>
              <option>Mobile App Testing</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Trainer Name</label>
            <select className="form-select">
              <option>Select Trainer</option>
              <option>Navya</option>
              <option>Havilla</option>
            </select>
          </div>
        </div>

        <div className="input-row">
        <div className="col-md-5">
            <label className="form-label">Select ID</label>
            <select className="form-select">
              <option>Select</option>
              <option>LinkedIn</option>
              <option>Facebook</option>
              <option>Twitter</option>
              <option>Instagram</option>
              <option>Other..</option>
            </select>
          </div>
          <div className="col-md-5">
        <Box sx={{ '& > legend': { mt: 2, ml: 1 } }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="user-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            sx={{ ml: 1, mt: 1 }}
          />
        </Box>
        </div>
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Review</label>
          <textarea
            className="form-control"
            rows="3"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
        </div>

        <div className='center'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default UserWriteReview;
