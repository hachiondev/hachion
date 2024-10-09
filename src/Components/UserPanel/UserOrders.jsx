import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiDownload } from "react-icons/fi";



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

function createData(S_No, course_name, Duration, Fee,Invoice_Bill) {
  return { S_No, course_name, Duration,Fee,Invoice_Bill};
}

const rows = [
  createData(1, 'QA Automation', '60 Days','30,000',<FiDownload/> ),
  createData(2, 'Python', '30 Days', '15,000',<FiDownload/>),
  
];

export default function UserOrders() {
  return (<>  
   <div className='courses-enrolled'>
    <h6>My orders</h6>
    </div>
    <div className='resume-div'>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 1300 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="right">Course Name</StyledTableCell>
            <StyledTableCell align="right">Duration</StyledTableCell>
            <StyledTableCell align="right">Fee</StyledTableCell>
            <StyledTableCell align="right">Invoice Bill</StyledTableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="right">{row.course_name}</StyledTableCell>
              <StyledTableCell align="right">{row.Duration}</StyledTableCell>
              <StyledTableCell align="right">{row.Fee}</StyledTableCell>
              <StyledTableCell align="right">{row.Invoice_Bill}</StyledTableCell>

            
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </>

  );
}
