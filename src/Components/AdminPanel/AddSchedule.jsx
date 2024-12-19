// import React from 'react'
// import AdminNavbar from './AdminNavbar'
// import AdminSidebar from './AdminSidebar'
// import { IoIosArrowForward } from 'react-icons/io'
// import { GoPlus } from "react-icons/go";
// import { IoClose } from "react-icons/io5";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// //import { borderRight, color } from '@mui/system';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: '#00AEEF',
//       color: theme.palette.common.white,
//       borderRight: '1px solid white', // Add vertical lines
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//       backgroundColor:'white',
//       color:theme.palette.common.black,
//       borderRight: '1px solid #d3d3d3', 
//     },
//   }));
  
//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     '&:last-child td, &:last-child th': {
//       border: 0,
//     },
//   }));
// const AddSchedule = () => {
//     const [age, setAge] = React.useState('');

//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };
//     function createData(Date,Frequency,Time,Duration,Mode,Pattern,Meeting,Add) {
//         return { Date,Frequency,Time,Duration,Mode,Pattern,Meeting,Add };
//       }
      
//       const rows = [
//         createData('MM DD YYYY', <Select
//             value={age}
//             onChange={handleChange}
//             displayEmpty
//           >
//             <MenuItem value="">
//               <em>Select</em>
//             </MenuItem>
//             <MenuItem value={10}>Only Weekends</MenuItem>
//             <MenuItem value={20}>Week days</MenuItem>
//             <MenuItem value={30}>Any days</MenuItem>
//           </Select>, <><OutlinedInput
//             id="outlined-adornment-weight"
//             endAdornment={<InputAdornment position="end">00:00</InputAdornment>}
//             aria-describedby="outlined-weight-helper-text"
//             inputProps={{
//               'aria-label': 'weight',
//             }}
//           /> <Select
//             value={age}
//             onChange={handleChange}
//             displayEmpty
//           >
//             <MenuItem value="">
//               <em>PM</em>
//             </MenuItem>
//             <MenuItem value={10}>AM</MenuItem>
          
           
//           </Select> </>,0,<Select
//             value={age}
//             onChange={handleChange}
//             displayEmpty
//           >
//             <MenuItem value="">
//               <em>Select</em>
//             </MenuItem>
//             <MenuItem value={10}>Live Class</MenuItem>
//             <MenuItem value={20}>Live Demo</MenuItem>
            
//           </Select>,'','',<><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}}/><IoClose style={{fontSize:'2rem',color:'red'}}/></>)
    
//       ];
      
//   return (
//   <>    <AdminNavbar />
//       <div style={{ display: 'flex', flexDirection: 'row' }}>
      
//         <AdminSidebar />
//         <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
//   <div className='course-category'>
// <p>Schedule <IoIosArrowForward/> Add Schedule </p>
// <div className='category'>
// <div className='category-header'>
// <p>Add Schedule</p>
// </div>
// <div className='course-details'>
// <div className='course-row'>
// <div class="col-md-3">
//     <label for="inputState" class="form-label">Category Name</label>
//     <select id="inputState" class="form-select">
//       <option selected>Select category</option>
//       <option>QA Testing</option>
//       <option>Project Management</option>
//       <option>Business Intelligence</option>
//       <option>DataScience</option>
//     </select>
//   </div>
//   <div class="col-md-3">
//     <label for="inputState" class="form-label">Course Name</label>
//     <select id="inputState" class="form-select">
//       <option selected>Select course</option>
//       <option>QA Automation</option>
//       <option>Load Runner</option>
//       <option>QA Manual Testing</option>
//       <option>Mobile App Testing</option>
//     </select>
//   </div>
//   <div class="col-md-3">
//     <label for="inputState" class="form-label">Trainer Name</label>
//     <select id="inputState" class="form-select">
//       <option selected>Select Trainer</option>
   
//     </select>
//     </div>
//   </div>
//   <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell align="center">Date</StyledTableCell>
//             <StyledTableCell align="right">Frequency</StyledTableCell>
//             <StyledTableCell align="right">Time</StyledTableCell>
//             <StyledTableCell align="right">Duration</StyledTableCell>
//             <StyledTableCell align="right">Mode</StyledTableCell>
//             <StyledTableCell align="right">Pattern</StyledTableCell>
//             <StyledTableCell align="right">Meeting</StyledTableCell>
//             <StyledTableCell align="right">Add/Delete Row</StyledTableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <StyledTableRow
//               key={row.name}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <StyledTableCell component="th" scope="row">
//                 {row.Date}
//               </StyledTableCell>
             
//               <StyledTableCell align="right">{row.Frequency}</StyledTableCell>
//               <StyledTableCell align="right">{row.Time}</StyledTableCell>
//               <StyledTableCell align="right">{row.Duration}</StyledTableCell>
//               <StyledTableCell align="right">{row.Mode}</StyledTableCell>
//               <StyledTableCell align="right">{row.Pattern}</StyledTableCell>
//               <StyledTableCell align="right">{row.Meeting}</StyledTableCell>
//               <StyledTableCell align="right">{row.Add}</StyledTableCell>
//             </StyledTableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
  
// <div style={{display:'flex',flexDirection:'row'}}> 
//   <button className='submit-btn'>Submit</button>
//   <button className='reset-btn'>Reset</button>
  
// </div>
// </div>
// </div>
// </div>
// </div>
// </div>
// </>

//   )
// }

// export default AddSchedule