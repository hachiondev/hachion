// import React, { useState } from 'react';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import certificateImage from '../../Assets/certificateImage.png';
// import Pagination from '@mui/material/Pagination';
// import './Admin.css';
// import { FaEdit } from 'react-icons/fa';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import CourseCategory from './CourseCategory';
// import { useNavigate } from 'react-router-dom';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import { IoMdCloseCircleOutline } from "react-icons/io";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#00AEEF',
//     color: theme.palette.common.white,
//     borderRight: '1px solid white',
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     borderRight: '1px solid #e0e0e0',
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// function createData(S_No, course_name, certificate_title, certificate_image, description,created_date, student_name, email, status) {
//   return { S_No, course_name, certificate_title, certificate_image, description,created_date ,student_name, email, status };
// }

// const courseCertificateRows = [
//     createData(1, 'Qa Automation','Qa Automation', <img src={certificateImage} alt='certificate'/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(2,'Python','Python', <img src={certificateImage} alt='certificate'/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
//     createData(3, 'Tableau','Tableau',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(4,'Big Data Hadoop','Big Data Hadoop',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
//     createData(5,'Salesforce Developer','Salesforce Developer', <img src={certificateImage} alt='certificate'/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05' ),
//     createData(6, 'Salesforce Admin','Salesforce Admin',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(7, 'Data Science with Python','Data Science with Python',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(8, 'Blue Prism','Blue Prism',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(9, 'Load Runner','Load Runner',<img src={certificateImage} alt='certificate'/>, 'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
//     createData(10, 'Service now','Service now', <img src={certificateImage} alt='certificate'/>,'After completion of the Course online training program, candidates will get a course completion certificate','2024-07-05'),
// ];

// const candidateCertificateRows = [
//     createData(1, ' Qa Automation',null,null,null,null,'Priti Visaria','Pritivisa@gmail.com','Completed'),
//     createData(2, 'Python',null,null,null,null,'Mita Shah','raknmit2000@yahoo.com','Completed' ),
//     createData(3,  'Tableau',null,null,null,null,'Manhar','Manhartej@gmail.com','Completed'),
//     createData(4, 'Big Data Hadoop',null,null,null,null,'abc','abc@gmail.com','Completed' ),
//     createData(5, 'Salesforce Developer',null,null,null,null,'def','def@gmail.com','Completed' ),
//     createData(6,  'Salesforce Admin',null,null,null,null,'xyz','xyz@gmail.com','Completed'),
//     createData(7,  'Data Science with Python',null,null,null,null,'ghi','ghi@gmail.com','Completed'),
//     createData(8,  'Blue Prism',null,null,null,null,'Jkl','Jkl@gmail.com','Completed'),
//     createData(9,  'Load Runner',null,null,null,null,'Mno','Mno@gmail.com','Completed'),
//     createData(10,  'Service now',null,null,null,null,'Pqr','Pqr@gmail.com','Completed')
// ];

// export default function Certificate() {
//   const [activeTab, setActiveTab] = useState('courseCertificate'); // Default tab is Course Certificate
//   const [open, setOpen] = React.useState(false);

//   const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });
  
//   const handleClickOpen = (row) => {
//     setSelectedRow(row); // Set the selected row data
//     setOpen(true); // Open the modal
//   };
  
//   const handleClose = () => {
//     setOpen(false); // Close the modal
//   };
  
//   const handleSave = () => {
//     // Logic to handle saving the updated category and date
//     console.log('Saved:', selectedRow);
//     setOpen(false);
//   };
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedRow((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const navigate=useNavigate();
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };
// const handleAdd=()=>{
// navigate('/addcertificate')
// }
//   return (
//     <>   
//       <div className="certificate-tabs">
//         <div 
//           className={`tab-item ${activeTab === 'courseCertificate' ? 'active-tab' : ''}`}
//           onClick={() => handleTabChange('courseCertificate')}
//         >
//           Course Certificate
//         </div>
//         <div 
//           className={`tab-item ${activeTab === 'candidateCertificate' ? 'active-tab' : ''}`}
//           onClick={() => handleTabChange('candidateCertificate')}
//         >
//           Candidate Certificate
//         </div>
//       </div>
//       <CourseCategory
//         pageTitle="Certificate"
//         headerTitle="Course Certificate"
//         buttonLabel="Add Course Certificate"
//         onAdd={handleAdd}
        
//       />

//       {/* Tab Navigation */}
    

//       {/* Table Content */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell><Checkbox /></StyledTableCell>
//               <StyledTableCell>S.No.</StyledTableCell>

//               {activeTab === 'courseCertificate' ? (
//                 <>
//                   <StyledTableCell align="center">Course Name</StyledTableCell>
//                   <StyledTableCell align="center">Certificate Title</StyledTableCell>
//                   <StyledTableCell align="center">Certificate Image</StyledTableCell>
//                   <StyledTableCell align="center">Description</StyledTableCell>
//                   <StyledTableCell align="center">Created Date</StyledTableCell>
//                   <StyledTableCell align="center">Action</StyledTableCell>
//                 </>
//               ) : (
//                 <>
//                   <StyledTableCell align="center">Student Name</StyledTableCell>
//                   <StyledTableCell align="center">Email</StyledTableCell>
//                   <StyledTableCell align="center">Course Name</StyledTableCell>
//                   <StyledTableCell align="center">Status</StyledTableCell>
//                 </>
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(activeTab === 'courseCertificate' ? courseCertificateRows : candidateCertificateRows).map((row) => (
//               <StyledTableRow key={row.S_No}>
//                 <StyledTableCell><Checkbox /></StyledTableCell>
//                 <StyledTableCell>{row.S_No}</StyledTableCell>

//                 {activeTab === 'courseCertificate' ? (
//                   <>
//                     <StyledTableCell align="left">{row.course_name}</StyledTableCell>
//                     <StyledTableCell align="left">{row.certificate_title}</StyledTableCell>
//                     <StyledTableCell align="center">{row.certificate_image}</StyledTableCell>
//                     <StyledTableCell align="center">{row.description}</StyledTableCell>
//                     <StyledTableCell align="center">{row.created_date}</StyledTableCell>
//                     <StyledTableCell align="center">
//                   <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
//                   <RiDeleteBin6Line className="delete" />
//                 </StyledTableCell>
//                   </>
//                 ) : (
//                   <>
//                     <StyledTableCell align="left">{row.student_name}</StyledTableCell>
//                     <StyledTableCell align="left">{row.email}</StyledTableCell>
//                     <StyledTableCell align="left">{row.course_name}</StyledTableCell>
//                     <StyledTableCell align="center">{row.status}</StyledTableCell>
//                   </>
//                 )}
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <div className='pagination'>
//       <Pagination count={10} color="primary" />
//       </div>
//       <Dialog open={open} onClose={handleClose}>
//             <div className='dialog-title'>
//         <DialogTitle >Edit Course Certificate   <Button onClick={handleClose} className='close-btn'>
//             <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
//           </Button></DialogTitle>
//           </div>
//         <DialogContent>
//         <div className='row'>
// <div class="col">
//     <label for="inputState" class="form-label">Category Name</label>
//     <select id="inputState" class="form-select">
//       <option selected>{selectedRow.category_name}</option>
//       <option>QA Testing</option>
//       <option>Project Management</option>
//       <option>Business Intelligence</option>
//       <option>Data Science</option>
//     </select>
//   </div>
//   <div class="col">
//     <label for="inputState" class="form-label">Course Name</label>
//     <select id="inputState" class="form-select">
//       <option selected>{selectedRow.course_name}</option>
//       <option>QA Automation</option>
//       <option>Load Runner</option>
//       <option>QA Automation Testing</option>
//       <option>Mobile App Testing</option>
//     </select>
//   </div>
//   </div>
//           <div className="row">
//             <div className="col">
//               <label htmlFor="certificate_title" className="form-label">Certificate Title</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="certificate_title"
//                 name="certificate_title"
//                 value={selectedRow.certificate_title}
//                 onChange={handleInputChange}
//                 placeholder="Enter title"
//               />
//             </div>
//             <div className="col">
//               <label htmlFor="certificate_image" className="form-label">Certificate Image</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 id="certificate_image"
//                 name="certificate_image"
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>
//           <div className="mb-2">
//             <label htmlFor="description" className="form-label">Description</label>
//             <textarea
//               className="form-control"
//               id="description"
//               name="description"
//               rows="3"
//               value={selectedRow.description}
//               onChange={handleInputChange}
//             />
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleSave} className="update-btn">
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

import  React, { useEffect } from 'react';
import { useState } from 'react';
import { duration, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';

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


export default function CourseCertificate() {
  const[course,setCourse]=useState([]);
  const[courseCategory,setCourseCategory]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[certificate,setCertificate]=useState([]);
    const[filteredCertificate,setFilteredCertificate]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({certificate_image:"",course_name:"",category_name:"",title:"",description:"",});
    const [certificateData, setCertificateData] = useState([{
      id:"",
          certificate_image:null,
           course_name: "",
            date:currentDate,
           category_name:"",
           title:"",
           description:"",
           
         }]);
        const [currentPage, setCurrentPage] = useState(1);
                    const [rowsPerPage, setRowsPerPage] = useState(10);
                    
                    const handlePageChange = (page) => {
                     setCurrentPage(page);
                     window.scrollTo(0, window.scrollY);
                   };
                   // Inside your CourseCategory component
                 
                 const handleRowsPerPageChange = (rows) => {
                   setRowsPerPage(rows);
                   setCurrentPage(1); // Reset to the first page whenever rows per page changes
                 };
        
                 const displayedCourse = filteredCertificate.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                );

const handleFileChange = (e) => {
    setCertificateData((prev) => ({ ...prev, certificate_image: e.target.files[0] }));
  };

         const handleReset=()=>{
            setCertificateData([{
              id:"",
              certificate_image:null,
               course_name: "",
                date:currentDate,
               category_name:"",
               title:"",
               description:"",
                 }]);
        
         }
         const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditedData((prev) => ({
              ...prev,
              [name]: value,
            }));
          };
   
    const handleClose = () => {
      setOpen(false); // Close the modal
    };
 
    useEffect(() => {
      const fetchCertificate = async () => {
          try {
              const response = await axios.get('http://160.153.175.69:8080/HachionUserDashboad/certificate/certificate');
              setCertificate(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching certificate:", error.message);
          }
      };
      fetchCertificate();

      setFilteredCertificate(certificate);
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (id) => {
        if (window.confirm("Are you sure you want to delete this certificate")) {
          handleDelete(id);
        }
      };
  
   
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://160.153.175.69:8080/HachionUserDashboad/certificate/certificate/${editedData.id}`,editedData
            );
            setCertificate((prev) =>
                prev.map(curr =>
                    curr.id === editedData.id ? response.data : curr
                )
            );
            setMessage("Certificate updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Certificate.");
        }
    };
            
      const handleDelete = async (id) => {
       
         try { 
          const response = await axios.delete(`http://160.153.175.69:8080/HachionUserDashboad/certificate/certificate/delete/${id}`); 
          console.log("Certificate deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting certificate:", error); 
        } }; 
        useEffect(() => {
          const filtered = certificate.filter(certificate =>
              certificate.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              certificate.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) 
            
          );
          setFilteredCertificate(filtered);
      }, [searchTerm,filteredCertificate]);
 
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
            console.log(row);
              setEditedData(row)// Set the selected row data
              setOpen(true); // Open the modal
             
            };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      useEffect(() => {
        const fetchCategory = async () => {
          try {
            const response = await axios.get("http://160.153.175.69:8080/HachionUserDashboad/course-categories/all");
            setCourse(response.data); // Assuming the data contains an array of trainer objects
          } catch (error) {
            console.error("Error fetching categories:", error.message);
          }
        };
        fetchCategory();
      }, []);
      useEffect(() => {
        const fetchCourseCategory = async () => {
          try {
            const response = await axios.get("http://160.153.175.69:8080/HachionUserDashboad/courses/all");
            setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
          } catch (error) {
            console.error("Error fetching categories:", error.message);
          }
        };
        fetchCourseCategory();
      }, []);
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Create a FormData object to handle file uploads
        const formData = new FormData();
        
        // Add text data to the FormData object
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        formData.append("date", currentDate);
        formData.append("course_name", certificateData.course_name);
        formData.append("category_name", certificateData.category_name);
        formData.append("title", certificateData.title);
        formData.append("description", certificateData.description);
    
        // Add the image file to the FormData object
        if (certificateData.certificate_image) {
            formData.append("certificate_image", certificateData.certificate_image);
        } else {
            alert("Please select an image.");
            return;
        }
    
        try {
            // Send the POST request with FormData
            const response = await axios.post("http://160.153.175.69:8080/HachionUserDashboad/certificate/certificate/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201 || response.status === 200) {
                alert("Certificate added successfully");
                setCertificateData([...certificateData, { ...certificateData, date: currentDate }]); // Update local state
                handleReset(); // Clear form fields
            }
        } catch (error) {
            console.error("Error adding certicate:", error.message);
            alert("Error adding certificate.");
        }
    };
    
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }



  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
        <li className="breadcrumb-item">
              <a href="#!" onClick={() => setShowAddCourse(false)}>Course Certificate</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Add Course Certificate
              </li>
            </ol>
          </nav>
<div className='category'>
<div className='category-header'>
<p>Add Course Certificate </p>
</div>

<div className='course-details'>
<div className='course-row'>
<div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={certificateData.category_name} onChange={handleChange}>
    <option value="" disabled>
          Select Category
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={certificateData.course_name} onChange={handleChange}>
    <option value="" disabled>
          Select Course
        </option>
        {courseCategory.map((curr) => (
          <option key={curr.id} value={curr.courseName}>
            {curr.courseName}
          </option>
        ))}
    </select>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label for="inputEmail4" class="form-label">Certificate Title</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='title' value={certificateData.title} onChange={handleChange}/>
  </div>
<div className="col">
                <label className="form-label">Banner Image</label>
                <input
                  type="file"
                  className="schedule-input"
                  name="banner_image"
                  onChange={handleFileChange}
                  required
                />
  </div>  
</div>

  <div class="mb-6">
    <label for="inputEmail4" class="form-label">Description</label>
    <textarea type="text" class="form-control" id="exampleFormControlTextarea1" name='description' value={certificateData.description} onChange={handleChange}/>
  </div>
  <div className='course-row'>
  <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
  <button className='reset-btn' onClick={handleReset}>Reset</button>
</div>
  </div>
  
</div>
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>Course Certificate</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }}/>
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }}
  />
            <button className='filter' >Filter</button>
           
          </div>
          <div className='entries'>
            <div className='entries-left'>
            <p style={{ marginBottom: '0' }}>Show</p>
  <div className="btn-group">
    <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      {rowsPerPage}
    </button>
    <ul className="dropdown-menu">
      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(10)}>10</a></li>
      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(25)}>25</a></li>
      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(50)}>50</a></li>
    </ul>
  </div>
  <p style={{ marginBottom: '0' }}>entries</p>
</div>
            <div className='entries-right'>
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Course Certificate
              </button>
            </div>
          </div>

        </div>
      </div>
    </LocalizationProvider>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center'>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Course Name</StyledTableCell>
            <StyledTableCell align='center'>Certificate Title</StyledTableCell>
            <StyledTableCell align="center">Certificate Image</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Created Date </StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCourse.length > 0
    ? displayedCourse.map((curr, index) => (
    <StyledTableRow key={curr.id}>
        <StyledTableCell align='center'>
            <Checkbox />
        </StyledTableCell>
        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
          </StyledTableCell> {/* S.No. */}
        <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
        <StyledTableCell align="center">{curr.title}</StyledTableCell>
        <StyledTableCell align="center">
            {curr.certificate_image ? (
                <img
                    src={curr.certificate_image}
                    alt={`Certificate ${index + 1}`}
                    style={{ width: "100px", height: "auto" }}
                />
            ) : (
                "No Image"
            )}
            </StyledTableCell>
        <StyledTableCell align="center">{curr.description}</StyledTableCell>
        <StyledTableCell align="center">{curr.date}</StyledTableCell>
        <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.id)} />
            </div>
        </StyledTableCell>
    </StyledTableRow>
))
: (
  <StyledTableRow>
    <StyledTableCell colSpan={9} align="center">
      No data available.
    </StyledTableCell>
  </StyledTableRow>
)}
</TableBody>
    </Table>
    </TableContainer>
    <div className='pagination-container'>
                  <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredCertificate.length} // Use the full list for pagination
              onPageChange={handlePageChange}
            />
                      </div>
    {message && <div className="success-message">{message}</div>}

    </div>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div >
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Course Certificate</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div className="course-row">
  <div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={editedData.category_name} onChange={handleInputChange}>
    <option value="" disabled>
          Select Category
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={editedData.course_name} onChange={handleInputChange}>
    <option value="" disabled>
          Select Course
        </option>
        {courseCategory.map((curr) => (
          <option key={curr.id} value={curr.courseName}>
            {curr.courseName}
          </option>
        ))}
    </select>
  </div>
  </div>
  <div className="course-row">
  <div className="col">
      <label htmlFor="courseName" className="form-label">Certificate Title</label>
      <input
        id="courseName"
        className="form-control"
        name="title"
        value={editedData.title || ""}
        onChange={handleInputChange}
     />
     
    </div>
  <div className="col-md-4">
                <label className="form-label">Certificate Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
                
              </div>
              </div>
            
    <div className="mb-6">
      <label htmlFor="courseName" className="form-label">Description</label>
      <input
        id="exampleFormControlTextarea1"
        className="form-control"
        name="description"
        value={editedData.description || ""}
        onChange={handleInputChange}
     />
    </div>
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>

    <div
                  className='modal fade'
                  id='exampleModal'
                  tabIndex='-1'
                  aria-labelledby='exampleModalLabel'
                  aria-hidden='true'
                >
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <button
                        data-bs-dismiss='modal'
                        className='close-btn'
                        aria-label='Close'
                        onClick={handleCloseModal}
                      >
                        <RiCloseCircleLine />
                      </button>

                      <div className='modal-body'>
                        <img
                          src={success}
                          alt='Success'
                          className='success-gif'
                        />
                        <p className='modal-para'>
                     Certificate Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
