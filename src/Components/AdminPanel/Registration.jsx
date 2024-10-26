import React, { useState } from 'react';
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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import CourseCategory from './CourseCategory';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { IoMdEye } from "react-icons/io";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
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

function createData(S_No, student_name, email, mobile, country, state, location, date, time_zone, status,course_name,status_date,live_demo,live_class,mentoring_mode,self_placed) {
  return { S_No, student_name, email, mobile, country, state, location, date, time_zone, status,course_name,status_date,live_demo,live_class,mentoring_mode,self_placed };
}

const registerlist = [
  createData(1, 'Priti Visara', 'Pritivisa@gmail.com', '201918555', 'United States', 'Massachusetts', 'Mansfield','2024-07-05','07:30 PM CEST','QA Automation','Active','2024-07-05'),
  createData(2, 'Mita Shah', 'rakanmit2000@yahoo.com', '6157011665', 'Bangladesh', null, 'Not Defined','2024-07-05','07:30 PM CEST','QA Automation','Active','2024-07-05'),
  createData(3, 'Manhar', 'Manhartejraj@gmail.com', '6178098765', 'India', null, 'Not Defined','2024-07-05','07:30 PM CEST','QA Automation','Active','2024-07-05'),
];

const studentdetails = [
  createData(1, 'Priti Visara', 'Pritivisa@gmail.com', '201918555', 'United States', null, null, '25-01-2019', 'CET', 'Active','Qa Automation',0,0,1,0,0),
  createData(2, 'Mita Shah', 'rakanmit2000@yahoo.com', '6157011665', 'Bangladesh', null, null, '12-5-2023', 'PDT', 'Inactive','Python',0,0,0,0,0),
  createData(3, 'Manhar', 'Manhartejraj@gmail.com', '6178098765', 'India', null, null, '01-04-2021', 'CST', 'Active','Tableau',0,2,0,0,0),
];

export default function Registration() {
  const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState('registerlist'); // Default tab is Register List
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
const handleAdd=()=>{
navigate('/addstudent')
}
  return (
    <>   
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'registerlist' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('registerlist')}
        >
          Register List
        </div>
        <div 
          className={`tab-item ${activeTab === 'studentdetails' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('studentdetails')}
        >
          Student Details
        </div>
        <div 
          className={`tab-item ${activeTab === 'importlead' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('importlead')}
        >
          Import Lead
        </div>
      </div>
      <CourseCategory
        pageTitle="Registration"
        headerTitle={activeTab === 'registerlist' ? 'Register List' : activeTab === 'studentdetails' ? 'Student Details' : 'Import Lead'}
        buttonLabel={activeTab === 'importlead' ? 'Upload Leads' : 'Add Student'}
        onAdd={handleAdd
        }
      />

      {/* Table Content */}
      {activeTab === 'importlead' ? (
        <div className="import-lead-form">
          <form>
           <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:'2vw'}}>
            <p>CSV File Format</p>
            <buttton className='download-btn'>Download</buttton>
           </div>
           <div className='lead-form'>
           <div className="mb-3">
  <label for="formFile" class="form-label">Upload CSV file</label>
  <input class="form-control" type="file" id="formFile"/>
  <p>Note : Upload the Leads carefully using CSV File Format to  upload Multiple Leads.</p>
  <button className='upload-btn'>Upload</button>
</div>
</div>
          </form>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>S.No.</StyledTableCell>
                {activeTab === 'registerlist' ? (
                  <>
                    <StyledTableCell align="center">Student Name</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Mobile</StyledTableCell>
                    <StyledTableCell align="center">Country</StyledTableCell>
                    <StyledTableCell align="center">State</StyledTableCell>
                    <StyledTableCell align="center">Location</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Time</StyledTableCell>
                    <StyledTableCell align="center">Course Name</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Status Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>

                  </>
                ) : (
                  <>
                    <StyledTableCell align="center">Student Name</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Mobile</StyledTableCell>
                    <StyledTableCell align="center">Country</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Time-zone</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Course Name</StyledTableCell>
                    <StyledTableCell align="center">Live Demo</StyledTableCell>
                    <StyledTableCell align="center">Live Class</StyledTableCell>
                    <StyledTableCell align="center">Mentoring Mode</StyledTableCell>
                    <StyledTableCell align="center">Self Placed</StyledTableCell>
                    <StyledTableCell align="center">View Live demo</StyledTableCell>
                    <StyledTableCell align="center">View Live Class</StyledTableCell>
                    <StyledTableCell align="center">View Mentoring Mode </StyledTableCell>
                    <StyledTableCell align="center">View Self Placed</StyledTableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === 'registerlist' ? registerlist : studentdetails).map((row) => (
                <StyledTableRow key={row.S_No}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell>{row.S_No}</StyledTableCell>
                  {activeTab === 'registerlist' ? (
                    <>
                      <StyledTableCell align="left">{row.student_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.country}</StyledTableCell>
                      <StyledTableCell align="center">{row.state}</StyledTableCell>
                      <StyledTableCell align="center">{row.location}</StyledTableCell>
                      <StyledTableCell align="center">{row.date}</StyledTableCell>
                      <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                      <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                      <StyledTableCell align="center">{row.status}</StyledTableCell>
                      <StyledTableCell align="center">{row.status_date}</StyledTableCell>
                      <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)}  />
                  <RiDeleteBin6Line className="delete" />
                </StyledTableCell>
                      
                    </>
                  ) : (
                    <>
                      <StyledTableCell align="left">{row.student_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.country}</StyledTableCell>
                      <StyledTableCell align="center">{row.date}</StyledTableCell>
                      <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                      <StyledTableCell align="center">{row.status}</StyledTableCell>
                      <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                      <StyledTableCell align="center">{row.live_demo}</StyledTableCell>
                      <StyledTableCell align="center">{row.live_class}</StyledTableCell>
                      <StyledTableCell align="center">{row.mentoring_mode}</StyledTableCell>
                      <StyledTableCell align="center">{row.self_placed}</StyledTableCell>
                      <StyledTableCell align="center"><IoMdEye style={{color:'#00AEEF'}}/></StyledTableCell>
                      <StyledTableCell align="center"><IoMdEye style={{color:'#00AEEF'}}/></StyledTableCell>
                      <StyledTableCell align="center"><IoMdEye style={{color:'#00AEEF'}}/></StyledTableCell>
                      <StyledTableCell align="center"><IoMdEye style={{color:'#00AEEF'}}/></StyledTableCell>

                    </>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab !== 'importlead' && (
        <div className='pagination'>
          <Pagination count={10} color="primary" />
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
            <div className='dialog-title'>
        <DialogTitle >Edit Registered Student   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
        <DialogContent>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <TextField
            autoFocus
            margin="dense"
            name="student_name"
            label="Student Name"
            type="text"
            fullWidth
            value={selectedRow.student_name}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="mobile"
            label="Mobile"
            type="number"
            fullWidth
            value={selectedRow.mobile}
            onChange={handleInputChange}
          />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={selectedRow.email}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="Password"
            type="text"
            fullWidth
          />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            autoFocus
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={selectedRow.location}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            value={selectedRow.state}
            onChange={handleInputChange}
          />
          
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
 <label for="inputEmail4" class="form-label">Time Zone</label>
 <input type="text" class="form-control" id="inputTime4" value={selectedRow.time_zone} onChange={handleInputChange}/>
<label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select">
      <option selected>{selectedRow.course_name}</option>
      <option>Qa Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>
</div>
<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Additional Email"
            type="email"
            fullWidth
            
          />
          <TextField
            autoFocus
            margin="dense"
            name="mobile"
            label="Additional Mobile"
            type="number"
            fullWidth
           
          />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} className="update-btn">
            Update
          </Button>
        </DialogActions>
      </Dialog>
  
    </>

  );
}
