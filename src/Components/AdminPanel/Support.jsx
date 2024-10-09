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
  createData(1,'Hach Prasad','laxmi.veena@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(2,'support1','hachion@gmail.com','hachion@321','61570553345','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(3,'Havila','havila@hachion.co','hachion@321','8133005987','Hyderabad','25-11-2017',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(4,'Vineetha','vineetha.v@gmail.com','hachion@321','2045681555','Hyderabad','25-1-2019',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(5, 'navitha','navithahachion@gmail.com','hachion@321','2019181555','Hyderabad','15-1-2019',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(6,'Ramakrishan','ramakrishan.hachion@gmail.com','hachion@321','6175081555','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(7, 'Srilatha','srilatha.hachion@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2023',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(8,'Pushpa','Pushpanjali.ahach@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(9, 'shoeb','shoeb.hachion@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  createData(10,'Suryansh','Suryansh.hach@gmail.com','hachion@321','2019181555','Hyderabad','25-11-2015',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
];

export default function Support() {
  return (
    <>   
    <CourseCategory
  pageTitle="Support"
  headerTitle="Support Details"
  buttonLabel="Add Support"
  onAdd={() => {
    // Navigate or perform another action
    console.log('Navigating to Add Trainer Category Page');
  }}

></CourseCategory> <TableContainer component={Paper}>
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
              <StyledTableCell align="center">{row.action}</StyledTableCell>
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
