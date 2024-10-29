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
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CourseCategory from './CourseCategory';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
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

function createData(S_No, trainer_name, course_name,demo1, demo2,demo3,summary,date,Action) {
  return { S_No, trainer_name,course_name,demo1,demo2,demo3,summary,date,Action};
}

const rows = [
  createData(1, 'Drishya','Qa Automation', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(2,'Harika','Python', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09' ),
  createData(3, 'Virendra','Tableau', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(4,'Virendra','Big Data Hadoop', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09' ),
  createData(5,'Vinod','Salesforce Developer', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09' ),
  createData(6, 'Ganesh','Salesforce Admin', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(7, 'Siddharth','Data Science with Python', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(8, 'Ravikant','Blue Prism', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(9, 'Sasi','Load Runner', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
  createData(10, 'Nag','Service now', 'Demo Link 1', 'Demo Link 2', 'Demo Link 3','Personal info: Trainer has more than.','2024-07-09'),
];

export default function Trainer() {
  const navigate=useNavigate();
  const [open, setOpen] = React.useState(false);

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
  const handleAdd=()=>{
    navigate('/addtrainer');
  }
  return (
    <>   
    <CourseCategory
  pageTitle="Trainer"
  headerTitle="View Trainer"
  buttonLabel="Add Trainer"
  onAdd={handleAdd}
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
            <StyledTableCell align="center">Summary</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
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
              <StyledTableCell align="center">{row.summary}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
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
        <DialogTitle >Edit Trainer   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
        <DialogContent>


          <div class="row">
  <div class="col">
    <label className='form-label'>Trainer</label>
    <input type="text" class="form-select" placeholder="Trainer name" aria-label="First name"
    margin="dense"
    name="trainer_name"
    label="Trainer Name"
    value={selectedRow.trainer_name}
    onChange={handleInputChange}/>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select">
      <option selected>{selectedRow.category_name}</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>Data Science</option>
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select">
      <option selected>{selectedRow.course_name}</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Automation Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  </div>
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Trainer Profile Summary</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  value={selectedRow.summary}
  onChange={handleInputChange}></textarea>
</div>
<div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 1</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline" 
    value={selectedRow.demo1}
    onChange={handleInputChange}/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 2</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
    value={selectedRow.demo2}
    onChange={handleInputChange}/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 3</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
    value={selectedRow.demo3}
    onChange={handleInputChange}/>
  </div>
</div>
       
        </DialogContent>
        <DialogActions>
        
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
 </> );
}
