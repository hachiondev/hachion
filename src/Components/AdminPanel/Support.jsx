import * as React from 'react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './Admin.css';
import TextField from '@mui/material/TextField';
import CourseCategory from './CourseCategory';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";

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

function createData(S_No,name,email,password,mobile,address,created_date,action) {
  return { S_No,name,email,password,mobile,address,created_date,action };
}

const rows = [
  createData(1,'Hach Prasad','laxmi.veena@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015'),
  createData(2,'support1','hachion@gmail.com','hachion@321','61570553345','Hyderabad','25-11-2015'),
  createData(3,'Havila','havila@hachion.co','hachion@321','8133005987','Hyderabad','25-11-2017'),
  createData(4,'Vineetha','vineetha.v@gmail.com','hachion@321','2045681555','Hyderabad','25-1-2019'),
  createData(5, 'navitha','navithahachion@gmail.com','hachion@321','2019181555','Hyderabad','15-1-2019'),
  createData(6,'Ramakrishan','ramakrishan.hachion@gmail.com','hachion@321','6175081555','Hyderabad','25-11-2015'),
  createData(7, 'Srilatha','srilatha.hachion@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2023'),
  createData(8,'Pushpa','Pushpanjali.ahach@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015'),
  createData(9, 'shoeb','shoeb.hachion@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015'),
  createData(10,'Suryansh','Suryansh.hach@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015'),
];

export default function Support() {
 
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [course, setCourse] = useState('');

  const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });
  
  const handleAddTrendingCourseClick = () => setShowAddCourse(true);

  const handleClickOpen = (row) => {
    setSelectedRow(row); // Set the selected row data
    setOpen(true); // Open the modal
  };
  
  const handleClose = () => {
    setOpen(false); // Close the modal
  };
  
  const handleSave = () => {
    // Logic to handle saving the updated category and date
    console.log('Saved:', selectedRow);
    setOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCourseChange = (event) => setCourse(event.target.value);
  
  return (

    <>  
     {showAddCourse?( <div className='course-category'>
<p>Support Details <IoIosArrowForward/> Add Support </p>
<div className='category'>
<div className='category-header'>
<p>Add Support</p>
</div>
<div class="row">

  <div class="col">
    <label className='form-label'>Name</label>
    <input type="text" class="form-control" placeholder="Enter Name" aria-label="First name"/>
  </div>
  <div class="col">
    <label className='form-label'>Mobile</label>
    <input type="number" class="form-control" placeholder="Enter Mobile" aria-label="First name"/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label className='form-label'>Email</label>
    <input type="email" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  <div class="col">
    <label className='form-label'>Password</label>
    <input type="password" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
</div>

  <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>

  <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
</div>
</div></div>) :(<>
    <CourseCategory
  pageTitle="Support"
  headerTitle="Support Details"
  buttonLabel="Add Support"
  onAddCategoryClick={handleAddTrendingCourseClick}/>
   <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Password</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="left">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="left">{row.password}</StyledTableCell>
              <StyledTableCell align="left">{row.mobile}</StyledTableCell>
              <StyledTableCell align="center">{row.address}</StyledTableCell>
              <StyledTableCell align="center">{row.created_date}</StyledTableCell>
              <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)}  />
                  <RiDeleteBin6Line className="delete" />
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className='pagination'>
      <Pagination count={10} color="primary" />
      </div>
      <Dialog open={open} onClose={handleClose}>
            <div className='dialog-title'>
        <DialogTitle >Edit Registered Student   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
          <DialogContent>
  <div style={{ display: 'flex', gap: '1rem' }}>
    <TextField
      autoFocus
      margin="dense"
      name="student_name"
      label="Student Name"
      type="text"
      fullWidth
      value={selectedRow.student_name}
      onChange={handleInputChange}
    />
    <TextField
      margin="dense"
      name="mobile"
      label="Mobile"
      type="number"
      fullWidth
      value={selectedRow.mobile}
      onChange={handleInputChange}
    />
  </div>
  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
    <TextField
      margin="dense"
      name="email"
      label="Email"
      type="email"
      fullWidth
      value={selectedRow.email}
      onChange={handleInputChange}
    />
    <TextField
      margin="dense"
      name="password"
      label="Password"
      type="text"
      fullWidth
    />
  </div>
  <TextField
    margin="dense"
    name="address"
    label="Address"
    type="text"
    fullWidth
    value={selectedRow.address}
    onChange={handleInputChange}
  />
</DialogContent>
        <DialogActions>
          <Button onClick={handleSave} className="update-btn">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      </>)}
 </> );
}
