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
import certificateImage from '../../Assets/certificateImage.png';
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

function createData(S_No, course_name, certificate_title, certificate_image, description,created_date, student_name, email, status) {
  return { S_No, course_name, certificate_title, certificate_image, description,created_date ,student_name, email, status };
}

const courseCertificateRows = [
    createData(1, 'Qa Automation','Qa Automation', <img src={certificateImage}/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(2,'Python','Python', <img src={certificateImage}/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
    createData(3, 'Tableau','Tableau',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(4,'Big Data Hadoop','Big Data Hadoop',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
    createData(5,'Salesforce Developer','Salesforce Developer', <img src={certificateImage}/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
    createData(6, 'Salesforce Admin','Salesforce Admin',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(7, 'Data Science with Python','Data Science with Python',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(8, 'Blue Prism','Blue Prism',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(9, 'Load Runner','Load Runner',<img src={certificateImage}/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
    createData(10, 'Service now','Service now', <img src={certificateImage}/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
];

const candidateCertificateRows = [
    createData(1, ' Qa Automation',null,null,null,null,'Priti Visaria','Pritivisa@gmail.com','Completed'),
    createData(2, 'Python',null,null,null,null,'Mita Shah','raknmit2000@yahoo.com','Completed' ),
    createData(3,  'Tableau',null,null,null,null,'Manhar','Manhartej@gmail.com','Completed'),
    createData(4, 'Big Data Hadoop',null,null,null,null,'abc','abc@gmail.com','Completed' ),
    createData(5, 'Salesforce Developer',null,null,null,null,'def','def@gmail.com','Completed' ),
    createData(6,  'Salesforce Admin',null,null,null,null,'xyz','xyz@gmail.com','Completed'),
    createData(7,  'Data Science with Python',null,null,null,null,'ghi','ghi@gmail.com','Completed'),
    createData(8,  'Blue Prism',null,null,null,null,'Jkl','Jkl@gmail.com','Completed'),
    createData(9,  'Load Runner',null,null,null,null,'Mno','Mno@gmail.com','Completed'),
    createData(10,  'Service now',null,null,null,null,'Pqr','Pqr@gmail.com','Completed')
];

export default function Certificate() {
  const [activeTab, setActiveTab] = useState('courseCertificate'); // Default tab is Course Certificate
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

  const navigate=useNavigate();
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
const handleAdd=()=>{
navigate('/addcertificate')
}
  return (
    <>   
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'courseCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseCertificate')}
        >
          Course Certificate
        </div>
        <div 
          className={`tab-item ${activeTab === 'candidateCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('candidateCertificate')}
        >
          Candidate Certificate
        </div>
      </div>
      <CourseCategory
        pageTitle="Certificate"
        headerTitle="Course Certificate"
        buttonLabel="Add Course Certificate"
        onAdd={handleAdd}
        
      />

      {/* Tab Navigation */}
    

      {/* Table Content */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>S.No.</StyledTableCell>

              {activeTab === 'courseCertificate' ? (
                <>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Certificate Title</StyledTableCell>
                  <StyledTableCell align="center">Certificate Image</StyledTableCell>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell align="center">Student Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {(activeTab === 'courseCertificate' ? courseCertificateRows : candidateCertificateRows).map((row) => (
              <StyledTableRow key={row.S_No}>
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>{row.S_No}</StyledTableCell>

                {activeTab === 'courseCertificate' ? (
                  <>
                    <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                    <StyledTableCell align="left">{row.certificate_title}</StyledTableCell>
                    <StyledTableCell align="center">{row.certificate_image}</StyledTableCell>
                    <StyledTableCell align="center">{row.description}</StyledTableCell>
                    <StyledTableCell align="center">{row.created_date}</StyledTableCell>
                    <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete" />
                </StyledTableCell>
                  </>
                ) : (
                  <>
                    <StyledTableCell align="left">{row.student_name}</StyledTableCell>
                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                    <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.status}</StyledTableCell>
                  </>
                )}
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
        <DialogTitle >Edit Course Certificate   <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button></DialogTitle>
          </div>
        <DialogContent>
        <div className='row'>
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
          <div className="row">
            <div className="col">
              <label htmlFor="certificate_title" className="form-label">Certificate Title</label>
              <input
                type="text"
                className="form-control"
                id="certificate_title"
                name="certificate_title"
                value={selectedRow.certificate_title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>
            <div className="col">
              <label htmlFor="certificate_image" className="form-label">Certificate Image</label>
              <input
                type="file"
                className="form-control"
                id="certificate_image"
                name="certificate_image"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={selectedRow.description}
              onChange={handleInputChange}
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
