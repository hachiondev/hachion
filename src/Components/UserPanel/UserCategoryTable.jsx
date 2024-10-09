import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import UserDashboard from './UserDashboard';


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

function createData(S_No, course_name, Date, Day,Time,Demo) {
  return { S_No, course_name, Date, Day,Time,Demo };
}

const rows = [
  createData(1, 'QA Automation', '2019-11-25','Thursday','07:30 PM IST', 'Live Demo'),
  createData(2, 'Python', '2022-12-11', 'Wednesday','08:15 PM IST','Live Demo'),
  
];

export default function UserCategoryTable() {
  return (<>  
 <div className='courses-enrolled'>
    <h6>Courses Enrolled</h6>
    </div>
    <div className='resume-div'>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 1300 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="right">Course Name</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Week</StyledTableCell>
            <StyledTableCell align="right">Time</StyledTableCell>
            <StyledTableCell align="right">Mode</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="right">{row.course_name}</StyledTableCell>
              <StyledTableCell align="right">{row.Date}</StyledTableCell>
              <StyledTableCell align="right">{row.Day}</StyledTableCell>
              <StyledTableCell align="right">{row.Time}</StyledTableCell>
              <StyledTableCell align="right">{row.Demo}</StyledTableCell>
            
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    
    </>

  );
}
