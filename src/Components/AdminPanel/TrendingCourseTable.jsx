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
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IoMdCloseCircleOutline } from "react-icons/io";

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

function createData(S_No, course_name, status, created_date, Action) {
  return { S_No, course_name, status, created_date, Action };
}

const rows = [
  createData(1, 'QA Automation','Enable', '2019-11-25'),
  createData(2, 'Python','Enable', '2022-12-11'),
  createData(3, 'Tableau','Enable', '2021-02-15'),
  createData(4, 'Big data Hadoop','Enable', '2020-05-12'),
  createData(5, 'Salesforce Developer','Enable', '2019-06-11'),
  createData(6, 'Data Science with Python','Enable', '2018-05-21'),
  createData(7, 'Blue Prism','Enable', '2019-05-18'),
  createData(8, 'Load Runner', 'Enable','2018-04-13'),
  createData(9, 'ServiceNow','Enable', '2019-06-11'),
  createData(10, 'Cloud Computing','Enable', '2019-06-11'),
];
export default function TrendingCourseTable() {
 
  const [open, setOpen] = React.useState(false);
  const navigate=useNavigate();

const onAddTrendingCourseClick=()=>{
  navigate('/addtrending')
}

const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });

const handleClickOpen = (row) => {
  setSelectedRow(row); // Set the selected row data
  setOpen(true); // Open the modal
};

const handleClose = () => {
  setOpen(false); // Close the modal
};

const handleSave = () => {
  // Logic to handle saving the updated category and date
  console.log('Saved:', selectedRow);
  setOpen(false);
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setSelectedRow((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  return (
  
     
        <>
          <CourseCategory
        pageTitle="Trending Courses"
        headerTitle="View Trending Courses"
        buttonLabel="Add Trending Courses"
        onAdd={onAddTrendingCourseClick} // Call the function passed from parent
      />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.S_No}>
                    <StyledTableCell><Checkbox /></StyledTableCell>
                    <StyledTableCell>{row.S_No}</StyledTableCell>
                    <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.status}</StyledTableCell>
                    <StyledTableCell align="center">{row.created_date}</StyledTableCell>
                    <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
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
          <Dialog open={open} onClose={handleClose}>
            <div className='dialog-title'>
        <DialogTitle >Edit Trending Course   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="course_name"
            label="Course Name"
            type="text"
            fullWidth
            value={selectedRow.course_name}
            onChange={handleInputChange}
          />
          <label>Status</label>
        <FormControlLabel control={<Switch defaultChecked />} label="Enable" />
       
        </DialogContent>
        <DialogActions>
        
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
        </>
   
  );
}
