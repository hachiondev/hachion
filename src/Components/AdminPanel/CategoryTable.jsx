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
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0',
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
const rows = [
  { id: 1, category_name: 'Project Management', Date: '2019-11-25', Action: 'Sandeep' },
  { id: 2, category_name: 'QA Testing', Date: '2022-12-11', Action: 'Pushpa' },
  { id: 3, category_name: 'Business Intelligence', Date: '2021-02-15', Action: 'Ram' },
  { id: 4, category_name: 'Data Science', Date: '2020-05-12', Action: 'Rahul' },
  { id: 5, category_name: 'Programming', Date: '2019-06-11', Action: 'Rakesh' },
  { id: 6, category_name: 'Big Data', Date: '2018-05-21', Action: 'John' },
  { id: 7, category_name: 'RPA', Date: '2019-05-18', Action: 'Ravi' },
  { id: 8, category_name: 'Salesforce', Date: '2018-04-13', Action: 'Suresh' },
  { id: 9, category_name: 'ServiceNow', Date: '2019-06-11', Action: 'Meena' },
  { id: 10, category_name: 'Cloud Computing', Date: '2019-06-11', Action: 'Anil' },
];
export default function CategoryTable() {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null); 
  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null); 
  };
  const handleSave = () => {
    console.log('Saved:', selectedRow);
    handleClose(); 
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}> 
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell align="center">{row.category_name}</StyledTableCell>
                <StyledTableCell align="center">{row.Date}</StyledTableCell>
                <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                  <RiDeleteBin6Line className="delete" />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <Pagination count={Math.ceil(rows.length / 10)} color="primary" /> {/* Dynamic page count */}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Category</DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
          <IoMdCloseCircleOutline style={{ color: 'white', fontSize: '2rem' }} />
        </Button>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="category_name"
            label="Category Name"
            type="text"
            fullWidth
            value={selectedRow?.category_name || ''} 
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Date"
            label="Date"
            type="date"
            fullWidth
            value={selectedRow?.Date || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} className='update-btn'>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}