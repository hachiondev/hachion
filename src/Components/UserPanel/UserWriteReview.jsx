import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import './Dashboard.css';

const UserWriteReview = ({ setShowReviewForm, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [course_name, setCourse_name] = useState('');
  const [trainer_name, setTrainer_name] = useState('');
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [social_id, setSocial_id] = useState('');

  // Fetch courses and trainers data on component load
  useEffect(() => {
    axios.get('https://api.hachion.co/courses/all')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
      });

    axios.get('https://api.hachion.co/trainers')
      .then(response => {
        setTrainers(response.data);
      })
      .catch(error => {
        console.error("Error fetching trainers:", error);
      });
  }, []);

  const handleSubmit = () => {
    const reviewData = {
      name,
      email,
      location,
      type,
      course_name,
      trainer_name,
      social_id,
      rating,
      review,
    };

    axios.post('https://api.hachion.co/userreview/add', reviewData)
      .then(response => {
        console.log("Review submitted successfully:", response.data);
        console.log(response);
        setShowReviewForm(false);
      })
      .catch(error => {
        console.error("Error submitting review:", error);
      });
  };

  return (
    <div className='write-review'>
      <div className='review-form-content'>
        <div className="input-row">
          <div className="col-md-5">
            <label className='form-label'>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className='form-label'>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="abc@gmail.com"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="col-md-5">
            <label className='form-label'>Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Location"
              aria-label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">Review Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Course Review">Course Review</option>
              <option value="Trainer Review">Trainer Review</option>
            </select>
          </div>
        </div>

        <div className="input-row">
          <div className="col-md-5">
            <label className="form-label">Course Name</label>
            <select
              className="form-select"
              value={course_name}
              onChange={(e) => setCourse_name(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.courseName}>{course.courseName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Trainer Name</label>
            <select
              className="form-select"
              value={trainer_name}
              onChange={(e) => setTrainer_name(e.target.value)}
            >
              <option value="">Select Trainer</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.trainer_name}>{trainer.trainer_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-row">
          <div className="col-md-5">
            <label className="form-label">Select ID</label>
            <select
              className="form-select"
              value={social_id}
              onChange={(e) => setSocial_id(e.target.value)}
            >
              <option value="">Select</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="Other">Other</option>
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
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>

        <div className='center'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default UserWriteReview;
