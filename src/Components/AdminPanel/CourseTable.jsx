import React, { useState } from 'react';
import axios from 'axios';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CourseTable = ({ courses, fetchCourses }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://160.153.175.69:8080/api/courses/${id}`);
      setSuccessMessage('Course deleted successfully!');
      fetchCourses(); // Refresh course list
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://160.153.175.69:8080/api/courses/${selectedRow.id}`, selectedRow);
      setSuccessMessage('Course updated successfully!');
      fetchCourses();
      setOpen(false);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow((prev) => ({ ...prev, [name]: value }));
  };
return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="center">Image</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((row, index) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>
                <Checkbox />
              </StyledTableCell>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell align="center">
                <img src={row.image} alt="Course" width="50" />
              </StyledTableCell>
              <StyledTableCell align="center">{row.courseName}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">
                <FaEdit onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <RiDeleteBin6Line onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer' }} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination count={10} style={{ marginTop: '20px' }} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Course Name"
            name="courseName"
            fullWidth
            value={selectedRow?.courseName || ''}
            onChange={handleInputChange}
          />
          {/* Add other fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default CourseTable;
