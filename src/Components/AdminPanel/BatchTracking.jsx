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
import AdminPagination from './AdminPagination';
import './Admin.css';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#00AEEF',
        color: theme.palette.common.white,
        borderRight: '1px solid white', // Add vertical lines
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
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
    // const [batchTracking, setBatchTracking] = useState([]);
    const [tracking, setTracking] = useState([]);
    // const [filterCourse, setFilterCourse] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
     const [studentData, setStudentData] = useState({
        student_id: "", email: "", category_name:"", course_name: "",type: "", batch_id: "",
        mobile: "", status: "", sessions_number: "",
        start: "", end: "", sessions_completed: "", remark: ""});
        const [batchTracking, setBatchTracking] = useState([
  {
    batch_id: "B001",
    student_id: "S001",
    userName: "John Doe",
    email: "john@example.com",
    mobile: "1234567890",
    course_name: "React JS",
    start: "2024-10-01",
    end: "2024-12-01",
    sessions_number: 30,
    sessions_completed: 20,
    status: "In Progress",
    remark: "Doing well",
    date: "2024-10-01"
  },
  {
    batch_id: "B002",
    student_id: "S002",
    userName: "Jane Smith",
    email: "jane@example.com",
    mobile: "0987654321",
    course_name: "Node JS",
    start: "2024-09-15",
    end: "2024-11-15",
    sessions_number: 25,
    sessions_completed: 25,
    status: "Completed",
    remark: "Excellent performance",
    date: "2024-09-15"
  },
]);
const [filterCourse, setFilterCourse] = useState([
  { id: 1, name: "Web Development", courseName: "React JS" },
  { id: 2, name: "Backend", courseName: "Node JS" }
]);
const [editRowId, setEditRowId] = useState(null);
const [editableRow, setEditableRow] = useState({});

const handleEditClick = (row) => {
  setEditRowId(row.student_id);
  setEditableRow({ ...row }); // clone to avoid direct mutation
};

const handleInputChange = (e, field) => {
  const { value } = e.target;
  setEditableRow((prev) => ({
    ...prev,
    [field]: value,
  }));
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
    const filteredData = batchTracking.filter((item) => {
        const date = new Date(item.date || item.payment_date);
        const matchesSearch =
          searchTerm === '' ||
          [item.name, item.email, item.course_name, item.status,item.mobile,item.start, item.end, item.student_id]
            .map(field => (field || '').toLowerCase())
            .some(field => field.includes(searchTerm.toLowerCase()));
        const inDateRange =
          (!startDate || date >= new Date(startDate)) &&
          (!endDate || date <= new Date(endDate));
        return matchesSearch && inDateRange;
      });
    
      const displayedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
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
                      <div className='category-header'><p>Batch Tracking</p></div>
                      <div className='date-schedule'>
                                      Start Date
                                      <DatePicker 
                              selected={startDate} 
                              onChange={(date) => setStartDate(date)} 
                              isClearable 
                              sx={{
                                '& .MuiIconButton-root':{color: '#00aeef'}
                            }}/>
                                      End Date
                                      <DatePicker 
                              selected={endDate} 
                              onChange={(date) => setEndDate(date)} 
                              isClearable 
                              sx={{
                                '& .MuiIconButton-root':{color: '#00aeef'}
                            }}
                            />
                                      <button className='filter' >Filter</button>
                                    </div>
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
                          <option value="Completed">Live Class</option>
                          <option value="In Progress">Live Demo</option>
                          </select>
                            </div>
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
                            <StyledTableCell align='center'><Checkbox /></StyledTableCell>
                            <StyledTableCell align='center'>S.No.</StyledTableCell>
                            <StyledTableCell align='center'>Student ID</StyledTableCell>
                            <StyledTableCell align='center'>Student Name</StyledTableCell>
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
  const isEditing = editRowId === row.student_id;
  return (
    <StyledTableRow key={row.batch_id || index}>
      <StyledTableCell><Checkbox /></StyledTableCell>
      <StyledTableCell>{index + 1}</StyledTableCell>
      <StyledTableCell align="left">{row.student_id}</StyledTableCell>
      <StyledTableCell align="left">{row.userName}</StyledTableCell>
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
            background: 'transparent'
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
          background: 'transparent'
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
            background: 'transparent'
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
            background: 'transparent'
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
            background: 'transparent'
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
            background: 'transparent'
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
                            