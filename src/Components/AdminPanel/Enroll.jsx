import React, { useEffect, useState } from "react";
import axios from "axios";
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



export default function Enroll() {
  const [enrollData, setEnrollData] = useState([]);

  useEffect(() => {
    axios.get("/HachionUserDashboad/enroll")
      .then((response) => {
        setEnrollData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/HachionUserDashboad/enroll/delete/${id}`);
      setEnrollData(enrollData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  
  return (
    <>
    <h3>All Enrolls</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Checkbox /></StyledTableCell>
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
              <StyledTableCell align="center">Resend email count</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollData.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                <StyledTableCell align="left">{row.email}</StyledTableCell>
                <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                <StyledTableCell align="center">{row.enroll_date}</StyledTableCell>
                <StyledTableCell align="center">{row.week}</StyledTableCell>
                <StyledTableCell align="center">{row.time}</StyledTableCell>
                <StyledTableCell align="center">{row.mode}</StyledTableCell>
                <StyledTableCell align="center">{row.type}</StyledTableCell>
                <StyledTableCell align="center">{row.trainer}</StyledTableCell>
                <StyledTableCell align="center">{row.completion_date}</StyledTableCell>
                <StyledTableCell align="center">{row.resendCount}</StyledTableCell>
                <StyledTableCell align="center">
                <RiDeleteBin6Line className="delete" onClick={() => handleDelete(row.id)} style={{ cursor: "pointer", color: "red" }} />

                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination'>
        <Pagination count={10} color="primary" />
      </div>
    </>
  );
}