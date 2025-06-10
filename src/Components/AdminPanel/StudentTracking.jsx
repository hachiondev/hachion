import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import './Admin.css';
// import React, {  } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function StudentTracking() {
    const [tracking, setTracking] = useState([]);
    const [filterCourse, setFilterCourse] = useState([]);
     const [studentData, setStudentData] = useState({
        student_id: "", name:"", mobile:"", email: "", category_name:"", course_name: "", status: "", batch_id: "", student_number: "", start_date: "", completed_date: "",number_of_sessions: "",completed_sessions: "", remarks: "",
      });
      const [batchOptions, setBatchOptions] = useState([]);
 const [categoryOptions, setCategoryOptions] = useState([]);
      const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
   useEffect(() => {
    const fetchStudentIds = async () => {
      try {
        const response = await axios.get(`https://api.hachion.co/studentsTracking?courseName=${encodeURIComponent(studentData.course_name)}`);
        const ids = response.data.map(id => ({ studentId: id }));
        setTracking(ids);
      } catch (error) {
        console.error("Error fetching student IDs:", error);
      }
    };

    fetchStudentIds();
  }, [studentData.course_name]);

  // useEffect(() => {
  //   const fetchEmail = async () => {
  //     if (!studentData.student_id) {
  //       setStudentData(prev => ({ ...prev, email: "" }));
  //       return;
  //     }

  //     try {
        
  //       const response = await axios.get(`https://api.hachion.co/studentsTracking/gettingEmail?studentId=${studentData.student_id}`);
        
  //       const emailFromApi = response.data.length > 0 ? response.data[0].email : "";
  //       setStudentData(prev => ({
  //         ...prev,
  //         email: emailFromApi || ""  
  //       }));
  //     } catch (error) {
  //       console.error("Failed to fetch email:", error);
  //       setStudentData(prev => ({ ...prev, email: "" }));
  //     }
  //   };

  //   fetchEmail();
  // }, [studentData.student_id]);
  useEffect(() => {
  const fetchEmail = async () => {
    if (!studentData.student_id) {
      setStudentData(prev => ({ ...prev, email: "", name: "", mobile: "" }));
      return;
    }

    try {
      const response = await axios.get(`https://api.hachion.co/studentsTracking/gettingEmail?studentId=${studentData.student_id}`);

      const student = response.data.length > 0 ? response.data[0] : null;

      setStudentData(prev => ({
        ...prev,
        email: student?.email || "",
        name: student?.name || "",
        mobile: student?.mobile || "",
      }));
    } catch (error) {
      console.error("Failed to fetch email and name:", error);
      setStudentData(prev => ({ ...prev, email: "", name: "", mobile: "" }));
    }
  };

  fetchEmail();
}, [studentData.student_id]);


   useEffect(() => {
  const fetchBatchIds = async () => {
    const { student_id, email } = studentData;
    // if (!student_id && !email) {
    //   setBatchOptions([]);
    //   setStudentData(prev => ({ ...prev, batch_id: "" }));
    //   return;
    // }

    if (!student_id) {
  setBatchOptions([]);
  setStudentData(prev => ({ ...prev, batch_id: "" }));
  return;
}
    try {
      const params = new URLSearchParams();
      if (student_id) params.append("studentId", student_id);
      if (email) params.append("email", email);

      const response = await axios.get(`https://api.hachion.co/studentsTracking/batches?${params.toString()}`);
      const validBatchIds = (response.data || []).filter(id => id !== null);
      setBatchOptions(validBatchIds);

      // Optionally preselect first batch
      // if (validBatchIds.length > 0) {
      //   setStudentData(prev => ({ ...prev, batch_id: validBatchIds[0] }));
      // } else {
      //   setStudentData(prev => ({ ...prev, batch_id: "" }));
      // }

    } catch (error) {
      console.error("Error fetching batch IDs:", error);
      setBatchOptions([]);
      setStudentData(prev => ({ ...prev, batch_id: "" }));
    }
  };

  fetchBatchIds();
}, [studentData.student_id, studentData.email]);

useEffect(() => {
  const fetchBatchInfo = async () => {
    try {
      const res = await axios.get(`https://api.hachion.co/batchInfo?batchId=${encodeURIComponent(studentData.batch_id)}`);
      const data = res.data;

      setStudentData(prev => ({
        ...prev,
        student_number: data.count,
        start_date: data.startDate,
        completed_date: data.completionDate
      }));
    } catch (error) {
      console.error('Error fetching batch info:', error);
    }
  };

  if (studentData.batch_id) {
    fetchBatchInfo();
  }
}, [studentData.batch_id]);


const handleUpdate = async () => {
  try {
    const payload = {
      studentName: studentData.student_name,
      studentEmail: studentData.email,
      mobile: studentData.student_number,
 startDate: dayjs(studentData.start_date).format("DD-MM-YYYY"),
      completedDate: dayjs(studentData.completed_date).format("DD-MM-YYYY"),
           numberOfSessions: studentData.number_of_sessions, // add this to your state if needed
      completedSessions: studentData.completed_sessions, // add this too
      batchStatus: studentData.status,
      remarks: studentData.remarks || ""
    };

    const response = await axios.post("https://api.hachion.co/studentsTracking/add", payload);
    console.log("Update successful:", response.data);
    alert("Student tracking updated successfully!");

  } catch (error) {
    console.error("Error updating student tracking:", error);
    alert("Failed to update student tracking.");
  }
};
   useEffect(() => {
  axios.get('https://api.hachion.co/course-categories/all')
    .then((response) => {
      setCategoryOptions(response.data); 
    })
    .catch((error) => {
      
    });
}, []);

useEffect(() => {
  if (studentData.category_name) {
    axios
      .get(`https://api.hachion.co/courses/coursenames-by-category?categoryName=${studentData.category_name}`)
      .then((response) => {
        const courseObjects = response.data.map(name => ({ courseName: name }));
        setFilterCourse(courseObjects);
      })
      .catch((error) => {
        console.error("Error fetching courses by category:", error);
      });
  }
}, [studentData.category_name]);


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                      <div className='category-header'><p style={{ marginBottom: 0 }}>Student Tracking</p></div>
                      <div className='course-details'>
                  <div className='course-row'>
                    {/* <div class="col">
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
                    </div> */}
                    <div className="col">
  <label htmlFor="inputState" className="form-label">Category Name</label>
  <select
  id="inputState"
  className="form-select"
  name="category_name"
  value={studentData.category_name}
  onChange={handleChange}
>
  <option value="" disabled>Select Category</option>
  {categoryOptions.map((curr) => (
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
          id="email"
          name="email"
          className="schedule-input"
          value={studentData.email}
          onChange={handleChange}
          placeholder="Enter or edit student email"
        />
      </div>
                    </div>
                    
                   <div className="course-row">
      
      <div className="col">
  <label htmlFor="batch_id" className="form-label">Batch ID</label>
  <select
    className="form-select"
    id="batch_id"
    name="batch_id"
    value={studentData.batch_id}
    onChange={handleChange}
  >
    <option value="">Select Batch ID</option>
    {batchOptions.map((batchId, index) => (
      <option key={index} value={batchId}>
        {batchId}
      </option>
    ))}
  </select>
</div>
                    <div className="col">
        <label htmlFor="student_number" className="form-label">No. of Students</label>
        <input
          type="text"
          className="schedule-input"
          id="student_number"
          name="student_number"
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
           value={studentData.start_date ? dayjs(studentData.start_date).format('DD-MM-YYYY') : ''}
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
                        value={studentData.completed_date ? dayjs(studentData.completed_date).format('DD-MM-YYYY') : ''}
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
                        value={studentData.start_date ? dayjs(studentData.start_date).format('DD-MM-YYYY') : ''}
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
                        value={studentData.completed_date ? dayjs(studentData.completed_date).format('DD-MM-YYYY') : ''}
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
                   <button className='submit-btn' onClick={handleUpdate}>Update</button>

                   </div>
                   </div>
                  </LocalizationProvider>
                                </>
                              );
                            }
                            