// import React, { useState, useEffect } from 'react';
// import AdminNavbar from './AdminNavbar';
// import AdminSidebar from './AdminSidebar';
// import { IoIosArrowForward } from 'react-icons/io';
// import axios from 'axios';
// import './Admin.css';

// const AddCourseDetails = ({ fetchCourses }) => {
//   const [courseName, setCourseName] = useState('');
//   const [categoryName, setCategoryName] = useState('');
//   const [youtubeLink, setYoutubeLink] = useState('');
//   const [noOfClasses, setNoOfClasses] = useState('');
//   const [dailySession, setDailySession] = useState('');
//   const [liveTrainingHours, setLiveTrainingHours] = useState('');
//   const [labExerciseHours, setLabExerciseHours] = useState('');
//   const [realTimeProjects, setRealTimeProjects] = useState('');
//   const [starRating, setStarRating] = useState('');
//   const [ratingByPeople, setRatingByPeople] = useState('');
//   const [totalEnrollment, setTotalEnrollment] = useState('');
//   const [courseImage, setCourseImage] = useState(null);

//   const resetForm = () => {
//     setCourseName('');
//     setCategoryName('');
//     setYoutubeLink('');
//     setNoOfClasses('');
//     setDailySession('');
//     setLiveTrainingHours('');
//     setLabExerciseHours('');
//     setRealTimeProjects('');
//     setStarRating('');
//     setRatingByPeople('');
//     setTotalEnrollment('');
//     setCourseImage(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('courseName', courseName);
//     formData.append('categoryName', categoryName);
//     formData.append('youtubeLink', youtubeLink);
//     formData.append('noOfClasses', noOfClasses);
//     formData.append('dailySession', dailySession);
//     formData.append('liveTrainingHours', liveTrainingHours);
//     formData.append('labExerciseHours', labExerciseHours);
//     formData.append('realTimeProjects', realTimeProjects);
//     formData.append('starRating', starRating);
//     formData.append('ratingByPeople', ratingByPeople);
//     formData.append('totalEnrollment', totalEnrollment);
//     formData.append('courseImage', courseImage);

//     try {
//       await axios.post('http://localhost:8080/api/courses', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       fetchCourses();
//       alert('Course added successfully!');
//       resetForm();
//     } catch (error) {
//       console.error('Error adding course:', error);
//       alert('Failed to add course.');
//     }
//   };

//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch all courses on load
//   useEffect(() => {
//     fetchCourses();
//     fetchCategories(); // Fetch course categories for dropdown
//   }, []);

//   // const fetchCourses = async () => {
//   //   try {
//   //     const response = await axios.get('/api/courses/all');
//   //     setCourses(response.data);
//   //     console.log('Courses fetched successfully:', response.data);
//   //   } catch (error) {
//   //     console.error('Error fetching courses:', error);
//   //     setError('Failed to load courses.');
//   //   }
//   // };


// const fetchCategories = async () => {
//     try {
//       const response = await axios.get('/api/categories/all'); // Adjusted API call for categories
//       setCategories(response.data);
//       console.log('Categories fetched successfully:', response.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       setError('Failed to load categories.');
//     }
//   };

//   // // Handle input change
//   // const handleInputChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setCourseData({
//   //     ...courseData,
//   //     [name]: value,
//   //   });
//   // };

//   // // Submit form to add course
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await axios.post('/api/courses/add', courseData);
//   //     console.log('Course added successfully:', response.data);
//   //     setCourses([...courses, response.data]); // Update local state with new course
//   //     setCourseData({}); // Clear form
//   //   } catch (error) {
//   //     console.error('Error adding course:', error);
//   //     setError('Failed to add course.');
//   //   }
//   // };

//   return (
//     <>
//       <AdminNavbar />
//       <div style={{ display: 'flex', flexDirection: 'row' }}>
//         <AdminSidebar />
//         <div style={{ flexGrow: 1, padding: '20px' }}>
//           <div className='course-category'>
//             <p>Course details <IoIosArrowForward /> Add Course Details</p>
//             <div className='category'>
//               <div className='category-header'>
//                 <p>Add Course Details</p>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className='course-row'>
//                   <div className="col-md-4">
//                     <label htmlFor="categoryName" className="form-label">Category Name</label>
//                     <select className="form-control" name="categoryName" value={courseData.categoryName || ''} onChange={handleInputChange}>
//                         <option value="">Select Category</option>
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.name}>{category.name}</option>
//                         ))}
//                       </select>
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="courseName" className="form-label">Course Name</label>
//                     <input type="text" className="form-control" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Enter Course name" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="courseImage" className="form-label">Course Images</label>
//                     <input className="form-control" type="file" id="courseImage" onChange={(e) => setCourseImage(e.target.files[0])} />
//                   </div>
//                 </div>
//                 <div className='course-row'>
//                   <div className="col-md-4">
//                     <label htmlFor="youtubeLink" className="form-label">Youtube Link</label>
//                     <input type="text" className="form-control" id="youtubeLink" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="Enter Youtube Link" />
//                   </div>
// <div className="col-md-4">
//                     <label htmlFor="noOfClasses" className="form-label">No. of Classes</label>
//                     <input type="number" className="form-control" id="noOfClasses" value={noOfClasses} onChange={(e) => setNoOfClasses(e.target.value)} placeholder="Enter number of classes" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="dailySession" className="form-label">Daily Session</label>
//                     <input type="text" className="form-control" id="dailySession" value={dailySession} onChange={(e) => setDailySession(e.target.value)} placeholder="Enter session" />
//                   </div>
//                 </div>
//                 <div className='course-row'>
//                   <div className="col-md-4">
//                     <label htmlFor="liveTrainingHours" className="form-label">Live Training hours</label>
//                     <input type="number" className="form-control" id="liveTrainingHours" value={liveTrainingHours} onChange={(e) => setLiveTrainingHours(e.target.value)} placeholder="Enter Hours" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="labExerciseHours" className="form-label">Lab Exercise Hours</label>
//                     <input type="number" className="form-control" id="labExerciseHours" value={labExerciseHours} onChange={(e) => setLabExerciseHours(e.target.value)} placeholder="Enter Hours" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="realTimeProjects" className="form-label">Real Time Projects</label>
//                     <input type="number" className="form-control" id="realTimeProjects" value={realTimeProjects} onChange={(e) => setRealTimeProjects(e.target.value)} placeholder="Enter projects" />
//                   </div>
//                 </div>
//                 <div className='course-row'>
//                   <div className="col-md-4">
//                     <label htmlFor="starRating" className="form-label">Star Rating</label>
//                     <input type="number" className="form-control" id="starRating" value={starRating} onChange={(e) => setStarRating(e.target.value)} placeholder="Enter Rating" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="ratingByPeople" className="form-label">Rating by No. of People</label>
//                     <input type="number" className="form-control" id="ratingByPeople" value={ratingByPeople} onChange={(e) => setRatingByPeople(e.target.value)} placeholder="Enter number of people" />
//                   </div>
//                   <div className="col-md-4">
//                     <label htmlFor="totalEnrollment" className="form-label">Total Enrollment</label>
//                     <input type="number" className="form-control" id="totalEnrollment" value={totalEnrollment} onChange={(e) => setTotalEnrollment(e.target.value)} placeholder="Enter No. Of Enrollment" />

//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'row' }}>
//                   <button type="submit" onclick={handleSubmit} className="submit-btn">Submit</button>
//                   <button type="button" onClick={resetForm} className="btn btn-secondary">Reset</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddCourseDetails;
