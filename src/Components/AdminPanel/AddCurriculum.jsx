import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {  color } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#00AEEF',
      color: theme.palette.common.white,
      borderRight: '1px solid white', // Add vertical lines
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor:'white',
      color:theme.palette.common.black,
      borderRight: '1px solid #d3d3d3', 
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
const AddCurriculum = () => {
    const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
    function createData(title,topic,Add) {
        return { title,topic,Add };
      }
      
      const rows = [
        createData('','',<><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}}/><IoClose style={{fontSize:'2rem',color:'red'}}/></>)
    
      ];
      
  return (
  <>    <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Curriculun <IoIosArrowForward/> Add Curriculum </p>
<div className='category'>
<div className='category-header'>
<p>Add Curriculum</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select category</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>DataScience</option>
    </select>
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select course</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
  </div>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">Topic</StyledTableCell>
            <StyledTableCell align="right">Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.topic}
              </StyledTableCell>
              <StyledTableCell align="right">{row.title}</StyledTableCell>
            
              <StyledTableCell align="right">{row.Add}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
<div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  
</div>
</div>
</div>
</div>
</div>
</div>
</>

  )
}

export default AddCurriculum