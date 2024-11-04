import * as React from 'react';
import { useState } from 'react';
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
import { IoIosArrowForward } from 'react-icons/io'
import CourseCategory from './CourseCategory';
import Pagination from '@mui/material/Pagination';
import automation from '../../Assets/automationtesting.png';
import salesforce from '../../Assets/salesforce.png';
import { useNavigate } from 'react-router-dom';
import EditBlog from './EditBlog';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
    wordWrap: 'break-word', // Allows text to wrap to the next line
    whiteSpace: 'normal',  // Ensures text breaks onto new lines
    maxWidth: 500,    
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

function createData(S_No, category_name, blog_image, blog_title, author,pdf,description,date,action) {
  return { S_No,  category_name, blog_image, blog_title, author,pdf,description,date,action};
}

const rows = [
  createData(1,'Project Management', <img src={salesforce} height={50}/>, '7 Reasons to Learn Salesforce in 2023 By','Sandeep P','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(2,'QA Testing', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Sandeep P','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>  ),
  createData(3, 'Business Intelligence', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Priyanka','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(4, 'Data Science', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Ramakrishna','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(5, 'Programming', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Hachion','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(6, 'Big Data', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Sandeep P','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(7, 'RPA', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Srilatha','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(8, 'salesforce', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Priyanka' ,'course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(9,'Service now', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Hachion','course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
  createData(10,'Cloud Computing', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Pushpa' ,'course.pdf','After completion of the Course online training program, candidates will get a course completion certificate','2024-05-07',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
];

export default function Blogs() {
  const navigate=useNavigate();
  const [editRow, setEditRow] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [course, setCourse] = useState('');

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);

const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });

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

  const handleEdit = (rowId) => {
    setEditRow(rowId);  // Set the clicked row's ID in the state
  };

  return (
    <>  
    {editRow ? (
        <EditBlog rowId={editRow} />  // Pass the row ID to the EditBlogForm
      ) : (<> 
      {showAddCourse?(<div className='course-category'>
<p>Blog Details <IoIosArrowForward/> Add Blog </p>
<div className='category'>
<div className='category-header'>
<p>Add Blog</p>
</div>
<div class="row">
<div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select Category</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>Data Science</option>
    </select>
  </div>
  <div class="col">
    <label className='form-label'>Blog Title</label>
    <input type="select" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label className='form-label'>Author</label>
    <input type="text" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  <div class="col">
  <label for="formFile" class="form-label">Blog Image</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<div class="col">
  <label for="formFile" class="form-label">Blog PDF</label>
  <input class="form-control" type="file" id="formFile"/>
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
</div></div>):(<>
    <CourseCategory
  pageTitle="Blog"
  headerTitle="Blog Details"
  buttonLabel="Add new Blog"
  onAddCategoryClick={handleAddTrendingCourseClick}
/>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Checkbox />
                </StyledTableCell>
                <StyledTableCell>S.No.</StyledTableCell>
                <StyledTableCell align="center">Category Name</StyledTableCell>
                <StyledTableCell align="center">Blog Image</StyledTableCell>
                <StyledTableCell align="center">Blog Title</StyledTableCell>
                <StyledTableCell align="center">Author</StyledTableCell>
                <StyledTableCell align="center">Blog PDF</StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center">Created Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.S_No}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell>{row.S_No}</StyledTableCell>
                  <StyledTableCell align="left">{row.category_name}</StyledTableCell>
                  <StyledTableCell align="center">{row.blog_image}</StyledTableCell>
                  <StyledTableCell align="center">{row.blog_title}</StyledTableCell>
                  <StyledTableCell align="center">{row.author}</StyledTableCell>
                  <StyledTableCell align="center">{row.pdf}</StyledTableCell>
                  <StyledTableCell align="center">{row.description}</StyledTableCell>
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">
                    <FaEdit className='edit' onClick={() => handleEdit(row.S_No)} /> 
                    <RiDeleteBin6Line className='delete' />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>)}
    </>  )}
      <div className='pagination'>
        <Pagination count={10} color="primary" />
      </div>
    </>
  );
}
