import  React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiUpload } from "react-icons/fi";
import { FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';

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
export default function OfflinePayment() {
  const[course,setCourse]=useState([]);
  const[courseCategory,setCourseCategory]=useState([]);
    const [filterCourse,setFilterCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[offlinePayment,setOfflinePayment]=useState([]);
    const[filteredPayment,setFilteredPayment]=useState([]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [rows, Rows] = useState([]);
    const [formMode, setFormMode] = useState("Add");
    const [paymentData, setPaymentData] = useState({
            id:"",
            student_ID: "",
            student_name: "",
            email:"",
            mobile: "",
           course_name: "",
           course_fee: "",
           tax:"",
           discount:"",
           installments: "",
           days: "",
           pay_date: "",
           due_date: "",
           method: "",
           actual_pay:"",
           received_pay:"",
           reference:"",
           total:"",
           balance:"",
           date:currentDate,
         });
        const [currentPage, setCurrentPage] = useState(1);
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const handlePageChange = (page) => {
          setCurrentPage(page);
           window.scrollTo(0, window.scrollY);
            };
                 const handleRowsPerPageChange = (rows) => {
                   setRowsPerPage(rows);
                   setCurrentPage(1);
                 };
                 const displayedCourse = filteredPayment.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                );
          const handleFileUpload = (index, e) => {
            const updatedRows = [...rows];
            updatedRows[index]['proof_image'] = e.target.files[0];
            Rows(updatedRows);
          };
    const handleDeleteConfirmation = (id) => {
        if (window.confirm("Are you sure you want to delete this Offline payment")) {
          handleDelete(id);
        }
      };
      const handleUpdate = async () => {
        try {
          const response = await axios.put(
            `https://api.test.hachion.co/offlinepayment/${paymentData.id}`, paymentData
          );
          setOfflinePayment(prev =>
            prev.map(item => item.id === paymentData.id ? response.data : item)
          );
          alert("Payment updated successfully");
          setShowAddCourse(false);
          setFormMode("Add");
        } catch (error) {
          alert("Error updating payment.");
        }
      };
      const handleDelete = async (id) => {
         try { 
        } catch (error) { 
        } }; 
      const handleClickOpen = (row) => {
        setPaymentData(row);
        setFormMode("Edit");
        setShowAddCourse(true);
      };
    const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...paymentData,
      [name]: value,
    };
    setPaymentData(updatedData);

    const courseFee = parseFloat(updatedData.course_fee) || 0;
    const tax = parseFloat(updatedData.tax) || 0;
    const discount = parseFloat(updatedData.discount) || 0;
    const count = parseInt(updatedData.installments) || 0;

    const actualTotalFee = Math.round(courseFee + tax - discount);
    const perInstallment = count > 0 ? Math.round(actualTotalFee / count) : 0;

    if (name === 'installments' || ['course_fee', 'tax', 'discount'].includes(name)) {
      if (!isNaN(count) && count > 0) {
        const generatedRows = Array.from({ length: count }, (_, idx) => ({
          pay_date: '',
          due_date: '',
          method: '',
          actual_pay: perInstallment,
          received_pay: '',
          proof_image: '',
          reference: '',
          installments: `${idx + 1}`
        }));
        Rows(generatedRows);
      } else {
        Rows([]);
      }

      // Also update total and balance
      setPaymentData((prev) => ({
        ...prev,
        total: actualTotalFee,
        balance: actualTotalFee,
      }));
    }
  };
      const handleRowChange = (index, e) => {
      const { name, value } = e.target;
      const updatedRows = [...rows];
      updatedRows[index][name] = value;
      Rows(updatedRows);

      // Parse numeric values from main form
      const courseFee = parseFloat(paymentData.course_fee) || 0;
      const tax = parseFloat(paymentData.tax) || 0;
      const discount = parseFloat(paymentData.discount) || 0;
      const actualTotalFee = courseFee + tax - discount;

      // Sum of received_pay
      const totalReceived = updatedRows.reduce((sum, row) => {
        const received = parseFloat(row.received_pay) || 0;
        return sum + received;
      }, 0);

      // Update total and balance in paymentData
      setPaymentData((prev) => ({
        ...prev,
        total: actualTotalFee,
        balance: Math.max(actualTotalFee - totalReceived, 0),
      }));
    };
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const currentDate = new Date().toISOString().split("T")[0]; 
        formData.append("date", currentDate);
        formData.append("course_name", paymentData.course_name);
        formData.append("student_name", paymentData.student_name);
         formData.append("student_ID", paymentData.student_ID);
        formData.append("email", paymentData.email);
        formData.append("mobile", paymentData.mobile);
        formData.append("course_fee", paymentData.course_fee);
        formData.append("tax", paymentData.tax);
         formData.append("discount", paymentData.discount);
        formData.append("installments", paymentData.installments);
        formData.append("days", paymentData.days);
        if (paymentData.proof_image) {
            formData.append("proof_image", paymentData.proof_image);
        } else {
            alert("Please select an image.");
            return;
        }
        try {
            const response = await axios.post("https://api.test.hachion.co/offlinepayment/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 201 || response.status === 200) {
                alert("Payment added successfully");
               setOfflinePayment(prev => [...prev, { ...paymentData, date: currentDate }]);
            }
        } catch (error) {
            alert("Error adding payment.");
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
            <a href="#!" onClick={() => {
              setShowAddCourse(false);
              setFormMode("Add");
            }}>
              View Offline Payment List
            </a>
            <MdKeyboardArrowRight />
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {formMode === "Edit" ? "Edit Payment" : "Add Payment"}
          </li>
        </ol>
      </nav>
<div className='category'>
<div className='category-header'>
  <p>{formMode === "Edit" ? "Edit Payment" : "Add Payment"}</p>
</div>
<div className='course-details'>
<div className='course-row'>
  <div class="col">
    <label for="inputEmail4" class="form-label">Student ID</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='student_ID' value={paymentData.student_ID} onChange={handleChange}/>
  </div>
<div class="col">
    <label for="inputEmail4" class="form-label">Student Name</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='student_name' value={paymentData.student_name} onChange={handleChange}/>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Email</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='email' value={paymentData.email} onChange={handleChange}/>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Mobile Number</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='mobile' value={paymentData.mobile} onChange={handleChange}/>
  </div>
  </div>
  <div className='course-row'>
  <div className="col">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={paymentData.course_name}
          onChange={handleChange}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Course Fee</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='course_fee' value={paymentData.course_fee} onChange={handleChange}/>
  </div>
    <div class="col">
    <label for="inputEmail4" class="form-label">TAX</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='tax' value={paymentData.tax} onChange={handleChange}/>
  </div>
    <div class="col">
    <label for="inputEmail4" class="form-label">Discount</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='discount' value={paymentData.discount} onChange={handleChange}/>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">No. of Installments</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='installments' value={paymentData.installments} onChange={handleChange}/>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">No. of Days</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='days' value={paymentData.days} onChange={handleChange}/>
  </div>
</div>
 <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center' sx={{ fontSize: '16px' }}> Pay Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Due Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}> Payment Method</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Installment</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Actual Pay</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Received Pay</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Proof</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Reference</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((curr, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align='center'>
                <input
                  className='table-curriculum'
                  name='pay_date'
                  value={curr.pay_date}
                  onChange={(e) => handleRowChange(index, e)}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>
                <input
                  className='table-curriculum'
                  name='due_date'
                  value={curr.due_date}
                  onChange={(e) => handleRowChange(index, e)}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>
                <select
                  className='table-curriculum'
                  name='method'
                  value={curr.method}
                  onChange={(e) => handleRowChange(index, e)}
                >
                  <option value=''>Select</option>
                  <option value='Bank payment'>Bank payment</option>
                  <option value='paypal'>PayPal</option>
                  <option value='venmo'>Venmo</option>
                </select>
              </StyledTableCell>
              <StyledTableCell align='center'>
                {curr.installments}
              </StyledTableCell>
              <StyledTableCell align='center'>
                <input
                  className='table-curriculum'
                  name='actual_pay'
                  value={curr.actual_pay}
                  onChange={(e) => handleRowChange(index, e)}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>
                <input
                  className='table-curriculum'
                  name='received_pay'
                  value={curr.received_pay}
                  onChange={(e) => handleRowChange(index, e)}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>
                {curr.proof_image && typeof curr.proof_image !== 'string' ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={URL.createObjectURL(curr.proof_image)}
                      alt="proof"
                      style={{
                        width: 50,
                        height: 50,
                        cursor: 'pointer',
                        objectFit: 'cover',
                        borderRadius: 4,
                        border: '1px solid #ccc'
                      }}
                      onClick={() => window.open(URL.createObjectURL(curr.proof_image), '_blank')}
                    />
                    <FaTimesCircle
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        fontSize: '1rem',
                        color: 'red',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                      }}
                      onClick={() => {
                        const updatedRows = [...rows];
                        updatedRows[index].proof_image = '';
                        Rows(updatedRows);
                      }}
                    />
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer' }}>
                    <FiUpload className="edit" />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(index, e)}
                    />
                  </label>
                )}
              </StyledTableCell>
              <StyledTableCell align='center'>
                <input
                  className='table-curriculum'
                  name='reference'
                  value={curr.reference}
                  onChange={(e) => handleRowChange(index, e)}
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className='course-row'>
  <div class="col">
    <label for="inputEmail4" class="form-label">Total Amount</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='total' value={paymentData.total} onChange={handleChange}/>
  </div>
<div class="col">
    <label for="inputEmail4" class="form-label">Balance Pay</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='balance' value={paymentData.balance} onChange={handleChange}/>
  </div>
  </div>
  <div className='course-row'>
  {formMode === "Add" ? (
  <>
    <button className='submit-btn' onClick={handleSubmit}>Save</button>
    <button className='submit-btn' onClick={handleSubmit}>Send to Email</button>
  </>
) : (
  <>
    <button className='submit-btn' onClick={handleUpdate}>Update</button>
    <button className='submit-btn' onClick={handleSubmit}>Send to Email</button>
  </>
)}
</div>
  </div>
  
</div>
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>View Offline Payment List</p>
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
                <FiPlus /> Add Payment
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
            <StyledTableCell align='center'>Student ID</StyledTableCell>
            <StyledTableCell align='center'>Student Name</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Course Fee</StyledTableCell>
            <StyledTableCell align="center">No. of Installments</StyledTableCell>
            <StyledTableCell align="center">Balance Fee</StyledTableCell>
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
          </StyledTableCell>
        <StyledTableCell align="center">{curr.student_ID}</StyledTableCell>
        <StyledTableCell align="center">{curr.student_name}</StyledTableCell>
        <StyledTableCell align="center">{curr.email}</StyledTableCell>
        <StyledTableCell align="center">{curr.mobile}</StyledTableCell>
        <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
        <StyledTableCell align="center">{curr.course_fee}</StyledTableCell>
        <StyledTableCell align="center">{curr.installments}</StyledTableCell>
        <StyledTableCell align="center">{curr.balance}</StyledTableCell>
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
    <StyledTableCell colSpan={12} align="center">
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
              totalRows={filteredPayment.length} 
              onPageChange={handlePageChange}
            />
                      </div>
    {message && <div className="success-message">{message}</div>}
    </div>)}
 </> );
}