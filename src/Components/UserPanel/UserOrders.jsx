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
import { FiDownload } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#00AEEF',
//     color: theme.palette.common.white,
//     borderRight: '1px solid white', // Add vertical lines
//     fontSize: 18,
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

function createData(S_No, course_name, Duration, Fee,Invoice_Bill) {
  return { S_No, course_name, Duration,Fee,Invoice_Bill};
}

const rows = [
  createData(1, 'QA Automation', '60 Days','30,000',<FiDownload className='invoice-icon'/> ),
  createData(2, 'Python', '30 Days', '15,000',<FiDownload className='invoice-icon'/>),
  
];

export default function UserOrders() {
  const navigate=useNavigate();
  return (
  <>  
   <div className='courses-enrolled'>
   <nav className='dashboard-nav'>
    My orders</nav>
    </div>
    <div className='resume-div'>
      <div className='resume-div-table'>
      <div className='button-div'>
    <TableContainer component={Paper}>
            <Table className='resume-table' aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No.</TableCell>
                  <TableCell align="center" >Course Name</TableCell>
                  <TableCell align="center" >Duration</TableCell>
                  <TableCell align="center" >Fee</TableCell>
                  <TableCell align="center" >Invoice Bill</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.S_No} >
                    <TableCell align="center">{row.S_No}</TableCell>
                    <TableCell align="left" >{row.course_name}</TableCell>
                    <TableCell align="left" >{row.Duration}</TableCell>
                    <TableCell align="left" >{row.Fee}</TableCell>
                    <TableCell align="center" >{row.Invoice_Bill}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
    </div>
    <div>
    <button className='explore-btn'  onClick={()=>navigate('/CourseDetails')}>Explore All Courses</button>
    </div>
    </div>
    </div>
    </>

  );
}