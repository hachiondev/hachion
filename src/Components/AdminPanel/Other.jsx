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
import CourseCategory from './CourseCategory';
import { useNavigate } from 'react-router-dom';
import BannerImage from '../../Assets/BannerImage.jpg';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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

function createData(S_No,image,type,conversion,country,status,created_date,action) {
  return { S_No, image,type,conversion,country,status,created_date,action};
}

const rows = [
  createData(1,<img src={BannerImage} alt='banner-image'/>,'Amount_Convert',83,'United States','Disable','2024-07-05'),
  
];

export default function Other() {
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
    navigate('/addbanner');
  }
  return (
    <>   
    <CourseCategory
  pageTitle="Banner/Amount Conversion"
  headerTitle="Banner/Amount Conversion Details"
  buttonLabel="Add Banner/Amount"
  onAdd={handleAdd}
></CourseCategory> <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="center">Banner Image</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Amount Conversion</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.S_No}</StyledTableCell>
              <StyledTableCell align="left">{row.image}</StyledTableCell>
              <StyledTableCell align="left">{row.type}</StyledTableCell>
              <StyledTableCell align="center">{row.conversion}</StyledTableCell>
              <StyledTableCell align="center">{row.country}</StyledTableCell>
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
        <DialogTitle >Edit Banner/Amount Conversion   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
        <DialogContent>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div class="mb-3">
  <label for="formFile" class="form-label">Banner Image</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<div className="mb-3">
<label>Status</label>
<FormControlLabel required control={<Switch />} label="Disable" />
</div>
</div>
<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>


<div class="col-md-4">
    <label for="inputState" class="form-label">Country</label>
    <select id="inputState" class="form-select">
      <option selected>Select Country</option>
      <option>India</option>
      <option>USA</option>
      <option>Canada</option>
    </select>
    </div>
    <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Amount Conversion</label>
  <input type="text" class="form-control" id="exampleFormControlInput1" />
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
