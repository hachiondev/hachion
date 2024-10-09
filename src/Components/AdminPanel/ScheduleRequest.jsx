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

function createData(S_No,email,mobile,country,course_name,schedule_date) {
  return { S_No,email,mobile,country,course_name,schedule_date };
}

const rows = [
  createData(1,'Pritivisa@gmail.com','2019181555','United States', 'QA Automation', '2024-11-25'),
  createData(2,'raknmit2000@gmail.com','6157055334','Bangladesh', 'Python', '2024-12-11'),
  createData(3,'Mahartejraj@gmail.com' ,'8133003767','India','Tableau', '2024-02-15'),
  createData(4,'Simrannagpal@gmail.com', '6786900208','India','Big data Hadoop', '2024-05-12'),
  createData(5, 'abc@gmail.com','6786900208','Latvia','Salesforce Developer', '2024-06-11'),
  createData(6,'bhatacharjee.attreya@gmail.com' ,'6786900208','Canada','Data Science with Python', '2024-05-21'),
  createData(7, 'Swatikulkarni07@gmail.com','6786900208','Canada','Blue Prism', '2024-05-18'),
  createData(8,'Anishpatel_03@gmail.com' ,'6786900208','India','Load Runner','2024-04-13'),
  createData(9, 'bhalerao_01@yahoo.com','6786900208','India','ServiceNow', '2024-06-11'),
  createData(10,'Laxmidon@gmail.com', '6786900208','India','Cloud Computing', '2024-06-11'),
];

export default function ScheduleRequest() {
  return (
    <>   
    <CourseCategory
  pageTitle="Schedule Request"
  headerTitle="View Schedule"
  buttonLabel="Add"
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
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Schedule Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="left">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.mobile}</StyledTableCell>
              <StyledTableCell align="left">{row.country}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_date}</StyledTableCell>
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
