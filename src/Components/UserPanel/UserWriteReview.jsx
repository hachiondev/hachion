import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import './Dashboard.css';

const UserWriteReview = ({ setShowReviewForm, onSubmitReview }) => {
  const currentDate = new Date().toISOString().split("T")[0];

  const [reviewData, setReviewData] = useState({
    review_id: Date.now(),
    category_name: "",
    course_name: "",
    trainer_name: "",
    date: currentDate,
    student_name: "",
    email: "",
    source: "",
    review: "",
    user_image: "",
    rating: 0,
    type: "",
    social_id: ""
  });

  const [userEmail, setUserEmail] = useState("");
const [filteredTrainers, setFilteredTrainers] = useState([]);


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [filteredCourses, setFilteredCourses] = useState([]);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loginuserData")) || {};

    const emailFromStorage =
      storedUser.email ||
      storedUser.student_email ||
      storedUser.emailid ||
      storedUser.username ||
      "";

    const nameFromStorage =
      storedUser.name ||
      storedUser.fullname ||
      storedUser.student_name ||
      "";

    setUserEmail(emailFromStorage);

    setReviewData(prev => ({
      ...prev,
      student_name: prev.student_name || nameFromStorage,
      email: emailFromStorage,
    }));
  }, []);

useEffect(() => {
  if (!userEmail || !reviewData.course_name) {
    setFilteredTrainers([]);
    return;
  }

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(
        `https://api.test.hachion.co/enroll/trainers/${encodeURIComponent(
          userEmail
        )}/${encodeURIComponent(reviewData.course_name)}`
      );

      setFilteredTrainers(response.data || []);
    } catch (error) {
      console.error("Error fetching trainers by email and course:", error);
      setFilteredTrainers([]);
    }
  };

  fetchTrainers();
}, [userEmail, reviewData.course_name]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserCourses = async () => {
      try {
        const response = await axios.get(
          `https://api.test.hachion.co/enroll/courses/${encodeURIComponent(userEmail)}`
        );
    
        setFilteredCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching course names by email:", error);
        setFilteredCourses([]); 
      }
    };

    fetchUserCourses();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setReviewData(prevData => ({
      ...prevData,
      user_image: e.target.files[0],
    }));
  };

  const isFormValid = () => {
    const isTrainerRequired = reviewData.type === "Trainer Review";

    return (
      reviewData.student_name.trim() !== "" &&
      reviewData.email.trim() !== "" &&
      reviewData.type.trim() !== "" &&            
      reviewData.course_name.trim() !== "" &&
      (!isTrainerRequired || reviewData.trainer_name.trim() !== "") &&
      reviewData.review.trim() !== "" &&
      reviewData.rating > 0
    );
  };
const handleSubmit = async () => {
  
  const isCourseReview = reviewData.type === "Course Review";

  const typeBoolean = false; 

  const displayValue = isCourseReview ? "course" : "trainer";
  const reviewTypeValue = isCourseReview ? "course" : "trainer";

  const reviewPayload = {
    name: reviewData.student_name,
    email: reviewData.email,
    type: typeBoolean,              

    reviewType: reviewTypeValue,    
    course_name: reviewData.course_name,
    trainer_name: reviewData.trainer_name || "",
    social_id: reviewData.social_id,
    rating: reviewData.rating ? Number(reviewData.rating) : 5,
    review: reviewData.review,
    location: reviewData.location || "",
    display: displayValue,          
    date: new Date().toISOString().split("T")[0],
  };

  const formData = new FormData();
  formData.append("review", JSON.stringify(reviewPayload));

  if (reviewData.user_image) {
    formData.append(
      "user_image",
      reviewData.user_image,
      reviewData.user_image.name
    );
  }

  try {
    await axios.post(
      "https://api.test.hachion.co/userreview/add",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setSuccessMessage("Review submitted successfully!");
    setErrorMessage("");

    onSubmitReview(reviewPayload);

    setTimeout(() => {
      setSuccessMessage("");
      setShowReviewForm(false);
    }, 2000);
  } catch (error) {
    console.error("Error adding review:", error.response?.data || error.message);
    setErrorMessage("Failed to submit review. Please try again.");
    setTimeout(() => setErrorMessage(""), 3000);
    setSuccessMessage("");
  }
};

  return (
    <div>
      <div className="review-form-content">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="instructor-fields">
          <div>
            <label className="login-label">
              Student Name
            </label>
            <span className="star">*</span>
            <div className="register-field">
              <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Name"
                  name="student_name"
                  value={reviewData.student_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">Email</label>
            <span className="star">*</span>
            <div className="register-field">
              <div className="password-field">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  name="email"
                  value={reviewData.email}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="instructor-fields">
          <div>
            <label className="login-label">Image</label>
            <div className="register-field">
              <div className="password-field">
                <input
                  type="file"
                  className="form-control"
                  name="user_image"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">Review Type</label>
            <span className="star">*</span>
            <div className="register-field">
              <div className="password-field">
                <select
                  className="form-select"
                  name="type"
                  value={reviewData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Course Review">Course</option>
                  <option value="Trainer Review">Trainer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="instructor-fields">
          <div>
            <label className="login-label">Course Name</label>
            <span className="star">*</span>
            <div className="register-field">
              <div className="password-field">
                <select
                  className="form-select"
                  name="course_name"
                  value={reviewData.course_name}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {filteredCourses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">
              Trainer Name
              {reviewData.type === "Trainer Review" && (
                <span className="star">*</span>
              )}
            </label>

            <div className="register-field">
              <div className="password-field">
               <select
  className="form-select"
  name="trainer_name"
  value={reviewData.trainer_name}
  onChange={handleChange}
  disabled={reviewData.type !== "Trainer Review" || !reviewData.course_name}
>
  <option value="">Select Trainer</option>
  {filteredTrainers.map((trainer, index) => (
    <option key={index} value={trainer}>
      {trainer}
    </option>
  ))}
</select>

              </div>
            </div>
          </div>
        </div>

        <div className="instructor-fields">
          <div>
            <label className="login-label">Rating</label>
            <span className="star">*</span>
            <div className="register-field">
              <div className="password-field">
                <Box sx={{ '& > legend': { mt: 2, ml: 1 } }}>
                  <Rating
                    name="rating"
                    value={reviewData.rating}
                    onChange={(event, newValue) =>
                      setReviewData(prevData => ({
                        ...prevData,
                        rating: newValue || 0,
                      }))
                    }
                    sx={{ ml: 1, mt: 1 }}
                  />
                </Box>
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">Source</label>
            <div className="register-field">
              <div className="password-field">
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
            </div>
          </div>
        </div>

        <div>
          <label className="login-label">Review</label>
          <span className="star">*</span>
          <div className="register-field">
            <div className="password-field">
              <textarea
                className="form-control"
                placeholder="Write review"
                name="review"
                value={reviewData.review}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>
        </div>

        <div className="center">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserWriteReview;
