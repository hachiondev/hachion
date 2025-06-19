import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AdminPagination from './AdminPagination';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#00AEEF',
        color: theme.palette.common.white,
        padding: '3px 5px',
        borderRight: '1px solid white', 
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '3px 4px',
        borderRight: '1px solid #e0e0e0', 
    },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function BatchTracking() {
    
    const [tracking, setTracking] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
     const [studentData, setStudentData] = useState({
        student_id: "", name: "", email: "", category_name:"", course_name: "",type: "", batch_id: "",
        mobile: "", status: "", sessions_number: "",
        start: "", end: "", sessions_completed: "", remark: ""});
const [batchTracking, setBatchTracking] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [batchIdOptions, setBatchIdOptions] = useState([]);
const [filterCourse, setFilterCourse] = useState([
  { id: 1, name: "Web Development", courseName: "React JS" },
  { id: 2, name: "Backend", courseName: "Node JS" }
]);
const [allStudents, setAllStudents] = useState([]); 

const [editRowId, setEditRowId] = useState(null);
const [editableRow, setEditableRow] = useState({});
 const [filterCategory, setFilterCategory] = useState([]);
const [filterData, setFilterData] = useState({
  courseCategory: '',
  courseName: '',
  batchId: '',
  batchType: '',
  startDate: '',
  endDate: ''
});
const [filteredStudents, setFilteredStudents] = useState([]);

 useEffect(() => {
    axios.get('https://api.hachion.co/course-categories/all')
      .then((response) => {
        setFilterCategory(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching course categories:', error);
      });
  }, []);

  useEffect(() => {
  if (studentData.category_name) {
    axios
      .get(
        `https://api.hachion.co/courses/coursenames-by-category?categoryName=${encodeURIComponent(
          studentData.category_name
        )}`
      )
      .then((response) => {
        const courseList = response.data.map((courseName, index) => ({
          id: index,
          courseName,
        }));
        setFilterCourse(courseList);
        setStudentData((prev) => ({
          ...prev,
          course_name: '', 
        }));
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }
}, [studentData.category_name]);


const handleEditClick = (row) => {
  setEditRowId(row.student_id);
  setEditableRow({ ...row }); 
};

const handleInputChange = (e, field) => {
  const { value } = e.target;
  setEditableRow((prev) => ({
    ...prev,
    [field]: value,
  }));
};

useEffect(() => {
  if (
    studentData.category_name &&
    studentData.course_name &&
    studentData.type
  ) {
    const fetchBatchIds = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/studentsTracking/batch-ids', {
          params: {
            categoryName: studentData.category_name,
            courseName: studentData.course_name,
            batchType: studentData.type,
          },
        });

        setBatchIdOptions(response.data); 
      } catch (error) {
        console.error('Error fetching batch IDs:', error);
        setBatchIdOptions([]);
      }
    };

    fetchBatchIds();
  }
}, [studentData.category_name, studentData.course_name, studentData.type]);


const fetchFilteredStudents = async (data) => {
  try {
    // const formattedStartDate = data.startDate ? data.startDate.toISOString().split('T')[0] : null;
    // const formattedEndDate = data.endDate ? data.endDate.toISOString().split('T')[0] : null;

const payload = {
  ...(data.courseCategory ? { courseCategory: data.courseCategory } : {}),
  ...(data.courseName ? { courseName: data.courseName } : {}),
  ...(data.startDate ? { startDate: dayjs(data.startDate).format('YYYY-MM-DD') } : {}),
  ...(data.endDate ? { endDate: dayjs(data.endDate).format('YYYY-MM-DD') } : {}),
  ...(data.batchId ? { batchId: data.batchId } : {}),
  ...(data.batchType ? { batchType: data.batchType } : {})
};
    const response = await axios.post('https://api.hachion.co/studentsTracking/filter', payload);

    const mappedData = response.data.map(item => ({
      student_id: item.studentId,
      name: item.studentName,
      email: item.studentEmail,
      mobile: item.mobile,
      course_name: item.courseName,
      start: item.startDate,
      end: item.completedDate,
      sessions_number: item.numberOfSessions,
      sessions_completed: item.completedSessions,
      status: item.batchStatus,
      remark: item.remarks,
      batch_id: item.batchId,
    }));

    setFilteredData(mappedData); 
    setCurrentPage(1); 
  } catch (error) {
    console.error('Error filtering students:', error);
  }
};


const handleSave = (studentId) => {
  setBatchTracking((prev) =>
    prev.map((item) =>
      item.student_id === studentId ? { ...editableRow } : item
    )
  );
  setEditRowId(null);
  setEditableRow({});
};
      
      const displayedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
  
  const handleChange = (e) => {
  const { name, value } = e.target;

  setStudentData((prev) => ({
    ...prev,
    [name]: value,
  }));

  
  const fieldMap = {
    category_name: 'courseCategory',
    course_name: 'courseName',
    type: 'batchType',
    batch_id: 'batchId',
  };

  const filterKey = fieldMap[name] || name;

  setFilterData((prev) => ({
    ...prev,
    [filterKey]: value,
  }));
};
const handleStartDateChange = (date) => {
  setStartDate(date);
  setFilterData((prev) => ({ ...prev, startDate: date }));
};

const handleEndDateChange = (date) => {
  setEndDate(date);
  setFilterData((prev) => ({ ...prev, endDate: date }));
};

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                      <div className='category-header'>
                        <p style={{ marginBottom: 0 }}>Batch Tracking</p>
                        </div>
                      <div className='date-schedule'>
                                      Start Date
                                      <DatePicker 
                              selected={startDate} 
                               
                              onChange={handleStartDateChange}
                              isClearable 
                              sx={{
                                '& .MuiIconButton-root':{color: '#00aeef'}
                            }}/>
                                      End Date
                                      <DatePicker 
                              selected={endDate} 
                               
                              onChange={handleEndDateChange}
                              isClearable 
                              sx={{
                                '& .MuiIconButton-root':{color: '#00aeef'}
                            }}
                            />
                                      {/* <button className='filter' >Filter</button> */}
                                      <button className="filter" onClick={() => fetchFilteredStudents(filterData)}>Filter</button>

                                    </div>
                      <div className='course-details'>
                  <div className='course-row'>
                    <div class="col">
                        <label for="inputState" class="form-label">Category Name</label>
                        <select id="inputState" className="form-select" name="category_name" value={studentData.category_name}onChange={handleChange}
        >
          <option value="" disabled>Select Category</option>
          {filterCategory.map((curr) => (
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
                        <div class="col">
                        <label htmlFor="inputState" className="form-label">Batch Type</label>
                         <select
                          id="inputState"
                          className="form-select"
                          name='type'
                          value={studentData.type}
                          onChange={handleChange}
                          >
                          <option value="">Select type</option>
                          <option value="Live Class">Live Class</option>
                          <option value="Live Demo">Live Demo</option>
                          </select>
                            </div>
                         
                      {/* <div className="col">
  <label htmlFor="batch_id" className="form-label">Batch ID</label>
  <select
    id="batch_id"
    className="form-select"
    name="batch_id"
    value={studentData.batch_id}
    onChange={handleChange}
  >
    <option value="" disabled>Select Batch ID</option>
    {batchIdOptions.map((id, index) => (
      <option key={index} value={id}>
        {id}
      </option>
    ))}
  </select>
</div> */}

<div className="col">
  <label htmlFor="batch_id" className="form-label">Batch ID</label>
  <input
    list="batchIdList"
    id="batch_id"
    className="form-control"
    name="batch_id"
    value={studentData.batch_id}
    onChange={handleChange}
    placeholder="Type or select batch ID"
  />
  <datalist id="batchIdList">
    {batchIdOptions.map((id, index) => (
      <option key={index} value={id} />
    ))}
  </datalist>
</div>

                        </div>
                          </div>
                          </div>
                        <div className='entries'>
                          <div className='entries-left'>
                            <p style={{ marginBottom: '0' }}>Show</p>
                            <div className="btn-group">
                              <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                {rowsPerPage}
                              </button>
                              <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(10)}>10</a></li>
                                <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(25)}>25</a></li>
                                <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(50)}>50</a></li>
                              </ul>
                            </div>
                            <p style={{ marginBottom: '0' }}>entries</p>
                          </div>
                          <div className='entries-right'>
                            <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                              <input
                                className="search-input"
                                type="search"
                                placeholder="Enter Name, Course Name or Method"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <button className="btn-search" type="submit">
                                <IoSearch style={{ fontSize: '2rem' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                    </LocalizationProvider>
                  <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center' style={{ width: '30px' }}><Checkbox /></StyledTableCell>
                            <StyledTableCell align='center'>S.No.</StyledTableCell>
                            <StyledTableCell align='center'>Student ID</StyledTableCell>
                            <StyledTableCell align='center'>Student Name</StyledTableCell>
                            <StyledTableCell align='center'>Batch Id</StyledTableCell>
                            <StyledTableCell align='center'>Email</StyledTableCell>
                            <StyledTableCell align="center">Mobile</StyledTableCell>
                            <StyledTableCell align="center">Course Name</StyledTableCell>
                            <StyledTableCell align="center">Course Start Date</StyledTableCell>
                            <StyledTableCell align="center">Course End Date</StyledTableCell>
                            <StyledTableCell align="center">No. of Sessions</StyledTableCell>
                            <StyledTableCell align="center">Completed Sessions</StyledTableCell>
                            <StyledTableCell align="center">Course Status</StyledTableCell>
                            <StyledTableCell align="center">Remarks </StyledTableCell>
                            <StyledTableCell align="center">Action </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
  {displayedData.map((row, index) => {
    console.log('Rendering Row:', row); 

    const isEditing = editRowId === row.student_id;

  return (
    <StyledTableRow key={row.batch_id || index}>
      <StyledTableCell><Checkbox /></StyledTableCell>
      <StyledTableCell>{index + 1}</StyledTableCell>
      <StyledTableCell align="left">{row.student_id}</StyledTableCell>
      <StyledTableCell align="left">{row.name}</StyledTableCell>
      <StyledTableCell align="left">{row.batch_id}</StyledTableCell>
      <StyledTableCell align="left">{row.email}</StyledTableCell>
      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
      <StyledTableCell align="left">{row.course_name}</StyledTableCell>

      <StyledTableCell align="left">
        {isEditing ? (
          <input
            type="date"
            value={editableRow.start}
            onChange={(e) => handleInputChange(e, 'start')}
            style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            padding: '3px 5px',
            background: '#b3b3b3'
          }}
          />
        ) : row.start}
      </StyledTableCell>

      <StyledTableCell align="left">
        {isEditing ? (
          <input
            type="date"
            value={editableRow.end}
            onChange={(e) => handleInputChange(e, 'end')}
          style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          padding: '3px 5px',
          background: '#b3b3b3'
        }}
          />
        ) : row.end}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isEditing ? (
          <input
            type="number"
            value={editableRow.sessions_number}
            onChange={(e) => handleInputChange(e, 'sessions_number')}
            style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            padding: '3px 5px',
            background: '#b3b3b3'
          }}
          />
        ) : row.sessions_number}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isEditing ? (
          <input
            type="number"
            value={editableRow.sessions_completed}
            onChange={(e) => handleInputChange(e, 'sessions_completed')}
            style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            padding: '3px 5px',
            background: '#b3b3b3'
          }}
          />
        ) : row.sessions_completed}
      </StyledTableCell>

      <StyledTableCell align="left">
        {isEditing ? (
          <select
            value={editableRow.status}
            onChange={(e) => handleInputChange(e, 'status')}
            style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            padding: '3px 5px',
            background: '#b3b3b3'
          }}
          >
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Hold">Hold</option>
            <option value="Other">Other</option>
          </select>
        ) : row.status}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isEditing ? (
          <input
            type="text"
            value={editableRow.remark}
            onChange={(e) => handleInputChange(e, 'remark')}
            style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            padding: '3px 5px',
            background: '#b3b3b3'
          }}
          />
        ) : row.remark}
      </StyledTableCell>

      <StyledTableCell align="center">
        {isEditing ? (
          <button className="update-row" onClick={() => handleSave(row.student_id)}>Update</button>
        ) : (
          <button className="update-row" onClick={() => handleEditClick(row)}>Edit</button>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
})}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                            
                                  <div className='pagination-container'>
                                    <AdminPagination
                                      currentPage={currentPage}
                                      rowsPerPage={rowsPerPage}
                                      totalRows={filteredData.length}
                                      onPageChange={setCurrentPage}
                                    />
                                  </div>                                </>
                              );
                            }
                            