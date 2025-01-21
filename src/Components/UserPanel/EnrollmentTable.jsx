import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { RiDeleteBinLine } from "react-icons/ri";
import './Blogs.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d3d3d3', // grey color for the table header
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.black, // white text color for table columns
    border: `1px solid ${theme.palette.common.black}`, // white border for each cell
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(course_name, batch, fee, discount, total, action) {
  return { course_name, batch, fee, discount, total, action };
}

const rows = [
  createData('Qa Automation', '2024-07-05 07:30 PM IST', '$37383', '0', '$37383', <RiDeleteBinLine style={{ color: 'red' }} />),
];

export default function EnrollmentTable() {
  return (
    <TableContainer component={Paper}>
      <Table className='table-details' sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell  align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Batch</StyledTableCell>
            <StyledTableCell align="center">Fee</StyledTableCell>
            <StyledTableCell align="center">% Discount</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.course_name}>
              <StyledTableCell component="th" scope="row"  align="center">
                {row.course_name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.batch}</StyledTableCell>
              <StyledTableCell align="center">{row.fee}</StyledTableCell>
              <StyledTableCell align="center">{row.discount}</StyledTableCell>
              <StyledTableCell align="center">{row.total}</StyledTableCell>
              <StyledTableCell align="center">{row.action}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
