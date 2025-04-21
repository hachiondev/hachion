
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


export default function Other() {
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
            date:currentDate,
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
              
                date:currentDate,
             
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
              const response = await axios.get('/HachionUserDashboad/banner');
              setBanner(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching resume:", error.message);
          }
      };
      fetchBanner();

      setFilteredBanner(banner);
  }, [banner]); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (banner_id) => {
        if (window.confirm("Are you sure you want to delete this banner")) {
          handleDelete(banner_id);
        }
      };
  
   
      const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
    
            // Convert JSON data to string and append it as a Blob
            formDataToSend.append("banner", new Blob([JSON.stringify(editedData)], { type: "application/json" }));
    
            // Ensure banner_image is sent only if updated
            if (editedData.banner_image instanceof File) {
                formDataToSend.append("banner_image", editedData.banner_image);
            } else {
                formDataToSend.append("banner_image", ""); // Prevent missing key issue
            }
    
            // Ensure home_banner_image is sent only if updated
            if (editedData.home_banner_image instanceof File) {
                formDataToSend.append("home_banner_image", editedData.home_banner_image);
            } else {
                formDataToSend.append("home_banner_image", "");
            }
    
            console.log("FormData Entries:");
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0], pair[1]); // Debugging output
            }
    
            // Send the update request
            const response = await axios.put(
                `/HachionUserDashboad/banner/update/${editedData.banner_id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            // Update banner list state
            setBanner((prev) =>
                prev.map(curr =>
                    curr.banner_id === editedData.banner_id ? response.data : curr
                )
            );
    
            setMessage("Banner updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            console.error("Error updating banner:", error.response?.data || error.message);
            setMessage("Error updating Banner.");
        }
    };
    
      const handleDelete = async (banner_id) => {
       
         try { 
          const response = await axios.delete(`/HachionUserDashboad/banner/delete/${banner_id}`); 
          console.log("Banner deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting banner:", error); 
        } }; 
      
 
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
      const handleSubmit = async (e, actionType) => {
        e.preventDefault();
      
        const formDataToSend = new FormData();
        const currentDate = new Date().toISOString().split("T")[0]; // Get today's date
      
        // Prepare the JSON data
        const jsonData = {
         
          date: currentDate,
         
        };
      
        // Conditionally append images and JSON fields based on actionType
        if (actionType === "banner" && bannerData.banner_image) {
          formDataToSend.append("banner_image", bannerData.banner_image);
          formDataToSend.append("home_banner_image", "");
        } 
        else if (actionType === "homeBanner" && bannerData.home_banner_image) {
          formDataToSend.append("banner_image", "");
          formDataToSend.append("home_banner_image", bannerData.home_banner_image);
        } 
     
      
        // Append JSON data as a Blob
        formDataToSend.append("banner", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
      
        try {
          const response = await axios.post("/HachionUserDashboad/banner/add", formDataToSend);
      
          if (response.status === 201) {
            alert("Banner added successfully!");
            
          }
        } catch (error) {
          console.error("Error submitting banner:", error.response?.data || error.message);
          alert(`Error: ${error.response?.data?.message || "Something went wrong!"}`);
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
         <a href="#!" onClick={() => setShowAddCourse(false)}>Banner</a> <MdKeyboardArrowRight />
         </li>
          <li className="breadcrumb-item active" aria-current="page">
          Add Banner
         </li>
          </ol>
        </nav>
<div className='category'>
<div className='category-header'>
<p>Add Banner </p>
</div>
<form onSubmit={handleSubmit} enctype="multipart/form-data">
<div>
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
                <label className="form-label">Home Banner Image (width=1440px, height=420px)</label>
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
<button className='submit-btn' onClick={(e) => handleSubmit(e, "homeBanner")}>Upload</button>
</div>
</div>
{/* <div className='course-details'>
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
                  
</div> */}

</div>
</form>
  </div>
  
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>Banner</p>
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
                <FiPlus /> Add Banner
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
            {/* <StyledTableCell align='center'>Type</StyledTableCell> */}
            {/* <StyledTableCell align="center">Amount Conversion</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell> */}
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
                src={`/HachionUserDashboad/${curr.banner_image}`} 
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
                src={`/HachionUserDashboad/${curr.home_banner_image}`} 
                    alt={`Banner ${index + 1}`}
                    style={{ width: "100px", height: "auto" }}
                />
            ) : (
                "No Image"
            )}
        </StyledTableCell>
        {/* <StyledTableCell align="center">{curr.type}</StyledTableCell> */}
        {/* <StyledTableCell align="center">{curr.amount_conversion}</StyledTableCell>
        <StyledTableCell align="center">{curr.country}</StyledTableCell> */}
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
        <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Banner</DialogTitle>
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
              {/* <div class="col-md-3">
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
     
    </div> */}
 


  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>

    {/* <div
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
                    </div> */}
   
 </> );
}