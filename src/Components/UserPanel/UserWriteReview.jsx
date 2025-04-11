import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import './Dashboard.css';

const UserWriteReview = ({ setShowReviewForm }) => {
  const currentDate = new Date().toISOString().split("T")[0]; // Get today's date

  const [reviewData, setReviewData] = useState({
    review_id: Date.now(),
    category_name: "",
    course_name: "",
    date: currentDate,
    student_name: "",
    source: "",
    review:"",
    user_image: "",
    rating: 0,
    type: false,
    social_id: ""
  });

  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  // Fetch courses and trainers data on component load
  useEffect(() => {
    axios.get('http://localhost:8080/courses/all')
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));

    axios.get('http://localhost:8080/trainers')
      .then(response => setTrainers(response.data))
      .catch(error => console.error("Error fetching trainers:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setReviewData((prevData) => ({
      ...prevData,
      user_image: e.target.files[0], // Store file object
    }));
  };

  const handleSubmit = async () => {
    const reviewPayload = {
        name: reviewData.student_name,
        email: reviewData.email || "",
        type: false,
        course_name: reviewData.course_name,
        trainer_name: reviewData.trainer_name || "",
        social_id: reviewData.social_id,
        rating: reviewData.rating ? Number(reviewData.rating) : 5,
        review: reviewData.review || "",
        location: reviewData.location || "",
        display:"course",
        date: new Date().toISOString().split("T")[0]
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewPayload)); // Attach JSON data

    if (reviewData.user_image) {
        formData.append("user_image", reviewData.user_image, reviewData.user_image.name); // Attach image
    }

    // Debugging FormData
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await axios.post(
            "http://localhost:8080/userreview/add",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        console.log("Review added successfully:", response.data);
        
    } catch (error) {
        console.error("Error adding review:", error.response?.data || error.message);
    }
};

  
  
  return (
    <div className='write-review'>
      <div className='review-form-content'>
        <div className="input-row">
          <div className="col-md-5">
            <label className='form-label'>Student Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              name="student_name"
              value={reviewData.student_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-5">
            <label className='form-label'>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="abc@gmail.com"
              name="email"
              value={reviewData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-row">
        <div className="col-md-5">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            name="user_image"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-md-5">
            <label className="form-label">Review Type</label>
            <select
              className="form-select"
              
            >
              <option value="">Select Type</option>
              <option value="Course Review">Course Review</option>
              <option value="Trainer Review">Trainer Review</option>
            </select>
          </div>
          </div>

        <div className="input-row">
          <div className="col-md-5">
            <label className='form-label'>Category Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Category"
              name="category_name"
              value={reviewData.category_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">Course Name</label>
            <select
              className="form-select"
              name="course_name"
              value={reviewData.course_name}
              onChange={handleChange}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.courseName}>{course.courseName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-row">
          <div className="col-md-5">
            <label className="form-label">Select ID</label>
            <select
              className="form-select"
              name="social_id"
              value={reviewData.social_id}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="Google">Google</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-5">
            <Box sx={{ '& > legend': { mt: 2, ml: 1 } }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={reviewData.rating}
                onChange={(event, newValue) =>
                  setReviewData((prevData) => ({ ...prevData, rating: newValue }))
                }
                sx={{ ml: 1, mt: 1 }}
              />
            </Box>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Review</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter review"
            name="review"
            value={reviewData.review}
            onChange={handleChange}
          />
        </div>

        <div className='center'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      </div>
  );
};

export default UserWriteReview;