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

function createData(S_No, student_name,email,mobile,course_name,date,week,time,mode,type,trainer,completed_date,action) {
  return { S_No, student_name,email,mobile,course_name,date,week,time,mode,type,trainer,completed_date,action };
}

const rows = [
  createData(1,'Priti visara','Pritivisa@gmail.com','2019181555', 'QA Automation', '2019-11-25','Thrusday','07:30 PM IST','Live demo','Login','Raghu','2024-07-05'),
  createData(2,'Mita Shah','raknmit2000@gmail.com','6157055334', 'Python', '2022-12-11','Thrusday','07:30 PM IST','Live demo','Login','Anjali','2024-07-05'),
  createData(3,'Manhar','Mahartejraj@gmail.com' ,'8133003767','Tableau', '2021-02-15','Thrusday','07:30 PM IST','Live demo','Login','Ganesh','2024-07-05'),
  createData(4,'Simranjeet Kaur','Simrannagpal@gmail.com', '6786900208','Big data Hadoop', '2020-05-12','Thrusday','07:30 PM IST','Live demo','Login','Raghu','2024-07-05'),
  createData(5, 'abc','abc@gmail.com','6786900208','Salesforce Developer', '2019-06-11','Thrusday','07:30 PM IST','Live demo','Login','Anjali','2024-07-05'),
  createData(6,'Attrayee bhatacharjee','bhatacharjee.attreya@gmail.com' ,'6786900208','Data Science with Python', '2018-05-21','Thrusday','07:30 PM IST','Live demo','Login','Ganesh','2024-07-05'),
  createData(7, 'Swati Kulkarni','Swatikulkarni07@gmail.com','6786900208','Blue Prism', '2019-05-18','Friday','07:30 PM IST','Live demo','Login','Raghu','2024-07-06'),
  createData(8,'Anish Patel','Anishpatel_03@gmail.com' ,'6786900208','Load Runner','2018-04-13','Friday','07:30 PM IST','Live demo','Login','Anjali','2024-07-06'),
  createData(9, 'Gaurav Bhalerao','bhalerao_01@yahoo.com','6786900208','ServiceNow', '2019-06-11','Friday','07:30 PM IST','Live demo','Login','Ganesh','2024-07-06'),
  createData(10,'Laxmi Dontula','Laxmidon@gmail.com', '6786900208','Cloud Computing', '2019-06-11','Friday','07:30 PM IST','Live demo','Login','Raghu','2024-07-06'),
];

export default function Enroll() {
  return (
    <>   
 <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="center">Student Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Enrollment Date</StyledTableCell>
            <StyledTableCell align="center">Week</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Mode</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Trainer</StyledTableCell>
            <StyledTableCell align="center">Completed Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="left">{row.student_name}</StyledTableCell>
              <StyledTableCell align="left">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.mobile}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">{row.week}</StyledTableCell>
              <StyledTableCell align="center">{row.time}</StyledTableCell>
              <StyledTableCell align="center">{row.mode}</StyledTableCell>
              <StyledTableCell align="center">{row.type}</StyledTableCell>
              <StyledTableCell align="center">{row.trainer}</StyledTableCell>
              <StyledTableCell align="center">{row.completed_date}</StyledTableCell>
              <StyledTableCell align="center">
      
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
 </> );
}