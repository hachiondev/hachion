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
  createData(1,<img src={BannerImage} alt='banner-image'/>,'Amount_Convert',83,'United States','Disable','2024-07-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
  
];

export default function Other() {
  const navigate=useNavigate();
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
              <StyledTableCell align="center">{row.action}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className='pagination'>
      <Pagination count={10} color="primary" />
      </div>
 </> );
}
