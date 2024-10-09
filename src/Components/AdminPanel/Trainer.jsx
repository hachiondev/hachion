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
import Pagination from '@mui/material/Pagination';
import './Admin.css';
import CourseCategory from './CourseCategory';

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

function createData(S_No, trainer_name, course_name,demo1, demo2,demo3) {
  return { S_No, trainer_name,course_name,demo1,demo2,demo3};
}

const rows = [
  createData(1, 'Drishya','Qa Automation', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(2,'Harika','Python', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3' ),
  createData(3, 'Virendra','Tableau', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(4,'Virendra','Big Data Hadoop', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3' ),
  createData(5,'Vinod','Salesforce Developer', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3' ),
  createData(6, 'Ganesh','Salesforce Admin', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(7, 'Siddharth','Data Science with Python', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(8, 'Ravikant','Blue Prism', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(9, 'Sasi','Load Runner', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
  createData(10, 'Nag','Service now', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3'),
];

export default function Trainer() {
  return (
    <>   
    <CourseCategory
  pageTitle="Trainer"
  headerTitle="View Trainer"
  buttonLabel="Add Trainer"
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
            <StyledTableCell align="center">Trainer Name</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Demo 1</StyledTableCell>
            <StyledTableCell align="center">Demo 2</StyledTableCell>
            <StyledTableCell align="center">Demo 3</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="left">{row.trainer_name}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">{row.demo1}</StyledTableCell>
              <StyledTableCell align="center">{row.demo2}</StyledTableCell>
              <StyledTableCell align="center">{row.demo3}</StyledTableCell>
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
