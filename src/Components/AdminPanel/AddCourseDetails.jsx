import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { IoIosArrowForward } from 'react-icons/io';
import axios from 'axios';
import './Admin.css';

const AddCourseDetails = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    courseName: '',
    courseImage: null,
    youtubeLink: '',
    numberOfClasses: '',
    dailySessions: '',
    liveTrainingHours: '',
    labExerciseHours: '',
    realTimeProjects: '',
    starRating: '',
    ratingByNumberOfPeople: '',
    totalEnrollment: '',
    courseCategory: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:8080/api/courses';
  const CATEGORY_API_URL = 'http://localhost:8080/api/course-categories';

  // Fetch course categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${CATEGORY_API_URL}/all`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage({ text: 'Failed to load categories. Please try again.', type: 'error' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await axios.post(`${API_URL}/add`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ text: 'Course added successfully!', type: 'success' });
      handleReset();
    } catch (error) {
      console.error('Error submitting course:', error);
      setMessage({ text: 'Failed to add the course. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      courseName: '',
      courseImage: null,
      youtubeLink: '',
      numberOfClasses: '',
      dailySessions: '',
      liveTrainingHours: '',
      labExerciseHours: '',
      realTimeProjects: '',
      starRating: '',
      ratingByNumberOfPeople: '',
      totalEnrollment: '',
      courseCategory: '',
    });
    setMessage({ text: '', type: '' });
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <div className="course-category">
            <p>
              Course Details <IoIosArrowForward /> Add Course Details
            </p>
            <div className="category">
              <div className="category-header">
                <p>Add Course Details</p>
              </div>
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="course-details">
                  <div className="course-row">
                    <div className="col-md-4">
                      <label className="form-label">Category Name</label>
                      <select
                        name="courseCategory"
                        className="form-select"
                        value={formData.courseCategory}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        name="courseName"
                        className="form-control"
                        placeholder="Enter Course Name"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Course Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="courseImage"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="course-row">
                    <div className="col-md-4">
                      <label className="form-label">Youtube Link</label>
                      <input
                        type="text"
                        name="youtubeLink"
                        className="form-control"
                        placeholder="Enter Youtube Link"
                        value={formData.youtubeLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">No. of Classes</label>
                      <input
                        type="number"
                        name="numberOfClasses"
                        className="form-control"
                        placeholder="Enter number of classes"
                        value={formData.numberOfClasses}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Daily Sessions</label>
                      <input
                        type="text"
                        name="dailySessions"
                        className="form-control"
                        placeholder="Enter daily session details"
                        value={formData.dailySessions}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="course-row">
                    <div className="col-md-4">
                      <label className="form-label">Live Training Hours</label>
                      <input
                        type="text"
                        name="liveTrainingHours"
                        className="form-control"
                        placeholder="Enter live training hours"
                        value={formData.liveTrainingHours}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Lab Exercise Hours</label>
                      <input
                        type="text"
                        name="labExerciseHours"
                        className="form-control"
                        placeholder="Enter lab exercise hours"
                        value={formData.labExerciseHours}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Real Time Projects</label>
                      <input
                        type="text"
                        name="realTimeProjects"
                        className="form-control"
                        placeholder="Enter projects"
                        value={formData.realTimeProjects}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="course-row">
                    <div className="col-md-4">
                      <label className="form-label">Star Rating</label>
                      <input
                        type="text"
                        name="starRating"
                        className="form-control"
                        placeholder="Enter rating"
                        value={formData.starRating}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Rating by No. of People</label>
                      <input
                        type="text"
                        name="ratingByNumberOfPeople"
                        className="form-control"
                        placeholder="Enter rating count"
                        value={formData.ratingByNumberOfPeople}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Total Enrollment</label>
                      <input
                        type="text"
                        name="totalEnrollment"
                        className="form-control"
                        placeholder="Enter total enrollment"
                        value={formData.totalEnrollment}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className='course-details'>
                  <h3>Key Highlights</h3>
                    <div className='course-row'>
                      <div class="col-md-4">
                        <label for="inputEmail4" class="form-label">Key Highlights 1</label>
                        <input type="text" class="form-control" id="inputEmail4" />
                      </div>
                      <div class="col-md-4">
                        <label for="inputEmail4" class="form-label">Key Highlights 2</label>
                        <input type="text" class="form-control" id="inputEmail4" />
                      </div>
                      <div class="col-md-4">
                        <label for="inputEmail4" class="form-label">Key Highlights 3</label>
                        <input type="text" class="form-control" id="inputEmail4" />
                      </div>
                    </div>
                    <div className='course-row'>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Key Highlights 4</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Key Highlights 5</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Key Highlights 6</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   </div>
 </div> 
 <h3>Mode Of Training</h3>
 <div className='course-row'>
 <div className='course-details'>
 <div class="form-check">
   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
   <label class="form-check-label" for="flexCheckDefault">
     Live Training
   </label>
 </div>
 <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Amount(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Discount%</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Total(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
 </div>
 <div className='course-details'>
 <div class="form-check">
   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
   <label class="form-check-label" for="flexCheckDefault">
     Mentoring Mode
   </label>
 </div>
 <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Amount(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Discount%</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Total(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
 </div>
 <div className='course-details'>
 <div class="form-check">
   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
   <label class="form-check-label" for="flexCheckDefault">
  Self Placed Training
   </label>
 </div>
 <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Amount(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Discount%</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Total(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
 </div>

 </div>
 <div className='course-details'>
 <div class="form-check">
   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
   <label class="form-check-label" for="flexCheckDefault">
  Self Placed Training
   </label>
 </div>
 <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Amount(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Discount%</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-3">
     <label for="inputEmail4" class="form-label">Total(INR)</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
 </div>

 </div>
  <h3>Sample session</h3>
 <div className='course-row'>
 <div className='course-details'>
   <h4>Mentoring Training</h4>
   <div className='course-col'>
   <div class="col-sm-3">
     <label for="inputEmail4" class="form-label">Day 1</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-sm-3">
     <label for="inputEmail4" class="form-label">Day 2</label>
     <input type="number" class="form-control" id="inputEmail4" />
   </div>
   </div>
  
   </div>
   <div className='course-details'>
   <h4>Mentoring Training</h4>
   <div className='course-col'>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Day 1</label>
   <input type="text" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Day 2</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   </div>
  
   </div>
 </div>
 <div className='course-row'>
 <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Header Title</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Course keyword with comma</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   <div class="col-md-4">
     <label for="inputEmail4" class="form-label">Course keyword description</label>
     <input type="text" class="form-control" id="inputEmail4" />
   </div>
   </div>
   <div class="mb-3">
   <label for="exampleFormControlTextarea1" class="form-label">Course Highlight(Only add 4 Lines)</label>
   <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
 </div>
 <div class="mb-3">
   <label for="exampleFormControlTextarea1" class="form-label">Course Description</label>
   <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
 </div> 

                  <div className="course-row">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Submitting...' : 'Add Course'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </form>
            </div>
            </div>
      
        </div>
      </div>
    </>
  );
};

export default AddCourseDetails;
