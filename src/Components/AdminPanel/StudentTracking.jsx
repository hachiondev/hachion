import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useState } from 'react';
import './Admin.css';

export default function StudentTracking() {
    const [tracking, setTracking] = useState([]);
    const [filterCourse, setFilterCourse] = useState([]);
     const [studentData, setStudentData] = useState({
        student_id: "", email: "", category_name:"", course_name: "", status: "", batch_id: "", student_number: "", start_date: "", completed_date: "",
      });

      const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                      <div className='category-header'><p style={{ marginBottom: 0 }}>Student Tracking</p></div>
                      <div className='course-details'>
                  <div className='course-row'>
                    <div class="col">
                        <label for="inputState" class="form-label">Category Name</label>
                        <select id="inputState" class="form-select" name='category_name' value={studentData.category_name} onChange={handleChange}>
                        <option value="" disabled>
                            Select Category
                            </option>
                            {filterCourse.map((curr) => (
                            <option key={curr.id} value={curr.name}>
                                {curr.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                          <label htmlFor="course" className="form-label">Course Name</label>
                          <select
                            id="course"
                            className="form-select"
                            name="course_name"
                            value={studentData.course_name}
                            onChange={handleChange}
                          >
                            <option value="" disabled>Select Course</option>
                            {filterCourse.map((curr) => (
                              <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col">
                          <label htmlFor="student_id" className="form-label">Student ID</label>
                          <select
                            className="form-select"
                            id="student_id"
                            name="student_id"
                            value={studentData.student_id}
                            onChange={handleChange}
                          >
                            <option value="">Select Student ID</option>
                            {tracking.map((student) => (
                              <option key={student.studentId} value={student.studentId}>
                                {student.studentId}
                              </option>
                            ))}
                          </select>
                        </div>
                    <div className="col">
                    <label htmlFor="email" className="form-label">Student Email</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="email"
                      name="email"
                      value={studentData.email}
                      onChange={handleChange}
                    />
                  </div>
                    </div>
                    <div className='course-row'>
                    <div className="col">
                    <label htmlFor="batch_id" className="form-label"> Batch ID</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="batch_id"
                      name="batch_id"
                      value={studentData.batch_id}
                      onChange={handleChange}
                    />
                  </div>
                    <div className="col">
                    <label htmlFor="student_number" className="form-label">No. of Students</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="student_number"
                      name="student_numbe"
                      value={studentData.student_number}
                      onChange={handleChange}
                    />
                  </div>
                        <div class="col">
                        <label htmlFor="inputState" className="form-label">Batch Status</label>
                         <select
                          id="inputState"
                          className="form-select"
                          name='status'
                          value={studentData.status}
                          onChange={handleChange}
                          >
                          <option value="">Select Status</option>
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Hold">Hold</option>
                          <option value="Other">Other</option>
                          </select>
                        </div>
                       <div className="col">
                        <label htmlFor="start_date" className="form-label">Start Date</label>
                        <input
                        type="text"
                        className="schedule-input"
                        id="start_date"
                        name="start_date"
                        value={studentData.start_date}
                        onChange={handleChange}
                        />
                    </div>
                        <div className="col">
                        <label htmlFor="completed_date" className="form-label">Completion Date</label>
                        <input
                        type="text"
                        className="schedule-input"
                        id="completed_date"
                        name="completed_date"
                        value={studentData.completed_date}
                        onChange={handleChange}
                        />
                    </div>        
                          </div>
                          </div>
                          </div>
                    <div className='category-header'><p style={{ marginBottom: 0 }}>Student Details</p></div>
                    <div className='course-details'>
                  <div className='course-row'>
                     <div className="col">
                    <label htmlFor="name" className="form-label">Student Name</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="name"
                      name="name"
                      value={studentData.name}
                      onChange={handleChange}
                    />
                  </div>
                    <div className="col">
                    <label htmlFor="email" className="form-label">Student Email</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="email"
                      name="email"
                      value={studentData.email}
                      onChange={handleChange}
                    />
                  </div>
                   <div className="col">
                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="mobile"
                      name="mobile"
                      value={studentData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                    </div>
                    <div className='course-row'>
                    <div className="col">
                        <label htmlFor="start_date" className="form-label">Start Date</label>
                        <input
                        type="text"
                        className="schedule-input"
                        id="start_date"
                        name="start_date"
                        value={studentData.start_date}
                        onChange={handleChange}
                        />
                    </div>
                        <div className="col">
                        <label htmlFor="completed_date" className="form-label">Completion Date</label>
                        <input
                        type="text"
                        className="schedule-input"
                        id="completed_date"
                        name="completed_date"
                        value={studentData.completed_date}
                        onChange={handleChange}
                        />
                    </div>        
                    <div className="col">
                    <label htmlFor="sessions" className="form-label">No. of Sessions</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="sessions"
                      name="sessions"
                      value={studentData.sessions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="sessions_completed" className="form-label">Completed Sessions</label>
                    <input
                      type="text"
                      className="schedule-input"
                      id="sessions_completed"
                      name="sessions_completed"
                      value={studentData.sessions_completed}
                      onChange={handleChange}
                    />
                  </div>
                        <div class="col">
                        <label htmlFor="inputState" className="form-label">Batch Status</label>
                         <select
                          id="inputState"
                          className="form-select"
                          name='status'
                          value={studentData.status}
                          onChange={handleChange}
                          >
                          <option value="">Select Status</option>
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Hold">Hold</option>
                          <option value="Other">Other</option>
                          </select>
                        </div>
                          </div>
                          <div className="col">
                    <label htmlFor="remarks" className="form-label">Remarks</label>
                    <textarea
                      type="text"
                      className="schedule-input"
                      id="remarks"
                      name="remarks"
                      value={studentData.remarks}
                      onChange={handleChange}
                    />
                  </div>
                  <div style={{display: 'flex',justifyContent: 'center'}}>
                   <button className='submit-btn'>Update</button>
                   </div>
                   </div>
                  </LocalizationProvider>
                                </>
                              );
                            }
                            