import * as React from 'react';
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
import CourseCategory from './CourseCategory';
import Pagination from '@mui/material/Pagination';
import automation from '../../Assets/automationtesting.png';
import salesforce from '../../Assets/salesforce.png';


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

function createData(S_No, category_name, blog_image, blog_title, author) {
  return { S_No,  category_name, blog_image, blog_title, author};
}

const rows = [
  createData(1,'Project Management', <img src={salesforce} height={50}/>, '7 Reasons to Learn Salesforce in 2023 By','Sandeep P' ),
  createData(2,'QA Testing', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Sandeep P'  ),
  createData(3, 'Business Intelligence', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Priyanka' ),
  createData(4, 'Data Science', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Ramakrishna' ),
  createData(5, 'Programming', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Hachion' ),
  createData(6, 'Big Data', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Sandeep P' ),
  createData(7, 'RPA', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Srilatha' ),
  createData(8, 'salesforce', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Priyanka' ),
  createData(9,'Service now', <img src={salesforce} height={50}/>, '	What Is Java Full Stack An Easy Guide for Developers','Hachion' ),
  createData(10,'Cloud Computing', <img src={automation} height={50}/>, 'Which is a better programming language for data science R or Python	','Pushpa' ),
];

export default function Blogs() {
  return (
    <>   
    <CourseCategory
  pageTitle="Blog"
  headerTitle="Blog Details"
  buttonLabel="Add new Blog"
  onAdd={() => {
    // Navigate or perform another action
    console.log('Navigating to Add Product Category Page');
  }}
></CourseCategory> <TableContainer component={Paper}>
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
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className='pagination'>
      <Pagination count={10} color="primary" />
      </div>
 </> );
}
