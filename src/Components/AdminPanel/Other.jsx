
import  React, { useEffect } from 'react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io'
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


export default function Review() {
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[banner,setBanner]=useState([]);
    const[filteredBanner,setFilteredBanner]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({banner_image:"",home_banner_image:"",status:"",country:"",amount_conversion:""});
    const [bannerData, setBannerData] = useState([{
        banner_id:"",
          banner_image:"",
          home_banner_image:"",
           type: "amount_conversion",
            date:currentDate,
           amount_conversion:"",
           country:"",
           status:"disabled",
           
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

         const displayedCourse = filteredBanner.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

        const handleFileChange = (e) => {
          setBannerData((prev) => ({ ...prev, banner_image: e.target.files[0] }));
        };
        const handleImageFileChange = (e) => {
          setBannerData((prev) => ({ ...prev, home_banner_image: e.target.files[0] }));
        };

         const handleReset=()=>{
            setBannerData([{
              banner_id:"",
              banner_image:null,
              home_banner_image:"",
               type: "amount conversion",
                date:currentDate,
               amount_conversion:"",
               country:"",
               status:"disabled",
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
      const fetchBanner = async () => {
          try {
              const response = await axios.get('http://160.153.175.69:8080/banner');
              setBanner(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching resume:", error.message);
          }
      };
      fetchBanner();

      setFilteredBanner(banner);
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (banner_id) => {
        if (window.confirm("Are you sure you want to delete this banner")) {
          handleDelete(banner_id);
        }
      };
  
   
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://160.153.175.69:8080/banner/update/${editedData.banner_id}`,editedData
            );
            setBanner((prev) =>
                prev.map(curr =>
                    curr.banner_id === editedData.banner_id ? response.data : curr
                )
            );
            setMessage("Banner updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Banner.");
        }
    };
            
      const handleDelete = async (banner_id) => {
       
         try { 
          const response = await axios.delete(`http://160.153.175.69:8080/banner/delete/${banner_id}`); 
          console.log("Banner deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting banner:", error); 
        } }; 
        useEffect(() => {
          const filtered = banner.filter(banner =>
              banner.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
              banner.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
              banner.type.toLowerCase().includes(searchTerm.toLowerCase()) 
            
          );
          setFilteredBanner(filtered);
      }, [searchTerm,filteredBanner]);
 
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
        setBannerData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure defaults are applied
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const formDataToSend = new FormData();
      
        // Append fields to formData
        formDataToSend.append("type", bannerData.type || "amount conversion");  // Default value
       formDataToSend.append("country",bannerData.country);
        formDataToSend.append("amount_conversion", bannerData.amount_conversion);
        formDataToSend.append("status", bannerData.status || "disabled");  // Default value
        formDataToSend.append("date", currentDate);
      
        // Handle file uploads
        if (bannerData.banner_image) formDataToSend.append("banner_image", bannerData.banner_image);
        if (bannerData.home_banner_image) formDataToSend.append("home_banner_image", bannerData.home_banner_image);
      
        // Log the formData content to check
        formDataToSend.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      
        try {
          const response = await axios.post(
            "http://160.153.175.69:8080/banner/add",
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status === 201) {
            alert("Banner added successfully");
            setFilteredBanner((prevBanner) => [...prevBanner, response.data]);
          }
        } catch (error) {
          console.error("Error submitting banner:", error.response ? error.response.data : error.message);
          alert("Error submitting banner.");
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
         <a href="#!" onClick={() => setShowAddCourse(false)}>Banner/Amount Conversion Details</a> <MdKeyboardArrowRight />
         </li>
          <li className="breadcrumb-item active" aria-current="page">
          Add Banner/Amount Conversion
         </li>
          </ol>
        </nav>
<div className='category'>
<div className='category-header'>
<p>Add Banner/Amount Conversion </p>
</div>
<form onSubmit={handleSubmit} enctype="multipart/form-data">
<div className='course-row'>
<div className='course-details'>
<div className="col">
                <label className="form-label">Banner popup Image</label>
                <input
                  type="file"
                  className="schedule-input"
            
                   accept="image/*"
                  name="banner_image"
                  onChange={handleFileChange}
                  required
                />
              </div>
<div className="update" style={{ display: 'flex', justifyContent: 'center' }}>
<button className='submit-btn'>Upload</button>
</div>
</div>
<div className='course-details'>
<div className="col">
                <label className="form-label">Home Banner Image</label>
                <input
                  type="file"
                  className="schedule-input"
                  accept="image/*"
                  name="home_banner_image"
                  onChange={handleImageFileChange}
                 
                  required
                />
              </div>
<div className="update" style={{ display: 'flex', justifyContent: 'center' }}>
<button className='submit-btn'>Upload</button>
</div>
</div>
<div className='course-details'>
<div class="col">
    <label for="inputState" class="form-label">Country</label>
    <select id="inputState" class="form-select" name='country' value={bannerData.country} onChange={handleChange}>
      <option selected>Select Country</option>
      <option>India</option>
      <option>USA</option>
      <option>Canada</option>
      <option>Australia</option>
    </select>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Amount Conversion</label>
    <input type="text" class="form-control" id="inputEmail4" name='amount_conversion' value={bannerData.amount_conversion} onChange={handleChange}/>
  </div>
  <div className="update" style={{ display: 'flex', justifyContent: 'center' }}>
  <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' type='submit'>Add amount</button>
                  </div>
                  
</div>

</div>
</form>
  </div>
  
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>Review</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }} />
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
                <FiPlus /> Add Banner/Amount
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
            <StyledTableCell sx={{ width: 70 }} align="center">
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell sx={{ width: 80 }} align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Banner Image</StyledTableCell>
            <StyledTableCell align='center'>Home Banner Image</StyledTableCell>
            <StyledTableCell align='center'>Type</StyledTableCell>
            <StyledTableCell align="center">Amount Conversion</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Status </StyledTableCell>
            <StyledTableCell align="center">Created Date </StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredBanner.map((curr, index) => (
    <StyledTableRow key={curr.banner_id}>
        <StyledTableCell align='center'>
            <Checkbox />
        </StyledTableCell>
        <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
        <StyledTableCell align="center">
            {curr.banner_image ? (
                <img
                src={`http://160.153.175.69:8080/${curr.banner_image}`} 
                    alt={`Banner ${index + 1}`}
                    style={{ width: "100px", height: "auto" }}
                />
            ) : (
                "No Image"
            )}
        </StyledTableCell>
        <StyledTableCell align="center">
            {curr.home_banner_image ? (
                <img
                src={`http://160.153.175.69:8080/${curr.home_banner_image}`} 
                    alt={`Banner ${index + 1}`}
                    style={{ width: "100px", height: "auto" }}
                />
            ) : (
                "No Image"
            )}
        </StyledTableCell>
        <StyledTableCell align="center">{curr.type}</StyledTableCell>
        <StyledTableCell align="center">{curr.amount_conversion}</StyledTableCell>
        <StyledTableCell align="center">{curr.country}</StyledTableCell>
        <StyledTableCell align="center">{curr.status}</StyledTableCell>
        <StyledTableCell align="center">{curr.date}</StyledTableCell>
        <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.banner_id)} />
            </div>
        </StyledTableCell>
    </StyledTableRow>
))}
</TableBody>
    </Table>
    </TableContainer>
    {message && <div className="success-message">{message}</div>}

    </div>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div >
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Banner/Amount Conversion</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  
  <div className="col-md-4">
                <label className="form-label">Banner Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
                <label>Status :</label>
                 <FormControlLabel  control={<Switch />} label="Disable" />
              </div>
      <div className="col-md-4">
        <label className="form-label">Home Banner Image</label>
        <input
          type="file"
          className="form-control"
          name="image"
          onChange={handleImageFileChange}
          required
        />
        <label>Status :</label>
          <FormControlLabel  control={<Switch />} label="Disable" />
      </div>
              <div class="col-md-3">
    <label for="inputState" class="form-label">Country</label>
    <select id="inputState" class="form-select" name='country' value={editedData.country} onChange={handleInputChange}>
      <option selected>Select </option>
      <option>India</option>
      <option>USA</option>
      <option>Canada</option>
      <option>Australia</option>
    </select>
</div>
   

    <div className="col">
      <label htmlFor="courseName" className="form-label">Amount Conversion</label>
      <input
        id="courseName"
        className="form-control"
        name="amount_conversion"
        value={editedData.amount_conversion || ""}
        onChange={handleInputChange}
     />
     
    </div>
 


  </DialogContent>
  <DialogActions>
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
                     Banner Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}