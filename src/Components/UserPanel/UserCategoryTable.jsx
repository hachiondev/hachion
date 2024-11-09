import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
//import { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Dashboard.css';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#00AEEF',
//     color: theme.palette.common.white,
//     borderRight: '1px solid white',
//     fontSize:18, // Add vertical lines
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 16,
//     borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

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
 <nav className='dashboard-nav'>
  Courses Enrolled</nav>
    </div>
    <div className="resume-div">
    <div className='resume-div-table'>
    <TableContainer component={Paper}>
            <Table className='resume-table' aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No.</TableCell>
                  <TableCell align="center" >Course Name</TableCell>
          <TableCell align="center">Date</TableCell>
          <TableCell align="center">Week</TableCell>
          <TableCell align="center">Time</TableCell>
          <TableCell align="center">Mode</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.S_No}>
            <TableCell align="center">{row.S_No}</TableCell>
            <TableCell align="left">{row.course_name}</TableCell>
            <TableCell align="center">{row.Date}</TableCell>
            <TableCell align="left">{row.Day}</TableCell>
            <TableCell align="left">{row.Time}</TableCell>
            <TableCell align="center">{row.Demo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</div>
</div>
    </>

  );
}
