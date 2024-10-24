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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

function createData(S_No, category_name, Date, Action) {
  return { S_No, category_name, Date, Action };
}

const rows = [
  createData(1, 'Project Management', '2019-11-25', 'Sandeep'),
  createData(2, 'QA Testing', '2022-12-11', 'Pushpa'),
  createData(3, 'Business Intelligence', '2021-02-15', 'Ram'),
  createData(4, 'Data Science', '2020-05-12', 'Rahul'),
  createData(5, 'Programming', '2019-06-11', 'Rakesh'),
  createData(6, 'Big Data', '2018-05-21', 'John'),
  createData(7, 'RPA', '2019-05-18', 'Ravi'),
  createData(8, 'Salesforce', '2018-04-13', 'Suresh'),
  createData(9, 'ServiceNow', '2019-06-11', 'Meena'),
  createData(10, 'Cloud Computing', '2019-06-11', 'Anil'),
];

export default function CategoryTable() {
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

  return (
    <>
      <CourseCategory />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Checkbox />
              </StyledTableCell>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.S_No}>
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>{row.S_No}</StyledTableCell>
                <StyledTableCell align="center">{row.category_name}</StyledTableCell>
                <StyledTableCell align="center">{row.Date}</StyledTableCell>
                <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete" />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination">
        <Pagination count={10} color="primary" />
      </div>

      {/* Dialog (Modal) for Editing */}
      <Dialog open={open} onClose={handleClose}>
        <div className='dialog-title'>

        <DialogTitle>Edit Category  </DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button>
        </div>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="category_name"
            label="Category Name"
            type="text"
            fullWidth
            value={selectedRow.category_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Date"
            label="Date"
            type="date"
            fullWidth
            value={selectedRow.Date}
            onChange={handleInputChange}
          />
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
