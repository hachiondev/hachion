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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


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
    const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
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
           status:"",
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
  const file = e.target.files[0];
  if (!file) return;
  const updatedRows = [...rows];
  updatedRows[index].proof_image = file;
  Rows(updatedRows);
};
useEffect(() => {
    if (rows.length === 0) {
      const today = dayjs();
      const defaultRows = Array.from({ length: 4 }, (_, idx) => ({
        pay_date: idx === 0 ? today.format('DD-MM-YYYY') : '',
        // due_date: today.add(idx, 'day').format('DD-MM-YYYY'),
         due_date: '',    // <-- start empty here
        method: '',
        actual_pay: '',
        received_pay: '',
        proof_image: '',
        reference: '',
        installments: `${idx + 1}`,
        installmentId: undefined,
      }));
      Rows(defaultRows);
    }
  }, []);

    const handleDeleteConfirmation = (id) => {
        if (window.confirm("Are you sure you want to delete this Offline payment")) {
          handleDelete(id);
        }
      };
      
      const handleDelete = async (id) => {
         console.log("Deleting id:", id);
          if (!id) {
    console.error("❌ Cannot delete: id is undefined or null");
    return;
  }
  try {
    const response = await axios.delete(`https://api.test.hachion.co/payments/${id}`);
    
    if (response.status === 200) {
      
      setSuccessMessage("✅ Payment deleted successfully.");
setErrorMessage("");
      
      setFilteredPayment((prev) => prev.filter((item) => item.id !== id));
    } else {
      setSuccessMessage("");
setErrorMessage("❌ Failed to delete payment.");
      
    }
  } catch (error) {
    console.error("Error deleting payment:", error);
     setSuccessMessage("");
    setErrorMessage("❌ Something went wrong while deleting the payment.");
  }
};

  const handleClickOpen = (row) => {
  setFormMode("Edit");
  setShowAddCourse(true);
  setSelectedPaymentId(row.id); 

  setPaymentData({
    student_ID: row.student_ID || "",
    student_name: row.student_name || "",
    email: row.email || "",
    mobile: row.mobile || "",
    course_name: row.course_name || "",
    course_fee: row.course_fee || "",
    tax: row.tax || 0,
    discount: row.discount || 0,
    installments: row.installments || "",
    days: row.days || "",
    total: row.total || "",
    // balance: row.balance || "",
    balance: row.balance ?? "",
    status: row.status ?? "",
  });

  const rowData = (row.rawInstallments || []).map((inst) => ({
    pay_date: inst.payDate ? dayjs(inst.payDate).format("DD-MM-YYYY") : "",
    due_date: inst.dueDate ? dayjs(inst.dueDate).format("DD-MM-YYYY") : "",
    method: inst.paymentMethod || "",
    actual_pay: inst.actualPay || "",
    received_pay: inst.receivedPay || "",
    proof_image: inst.proof ? inst.proof.split('/').pop() : "",
    reference: inst.reference || "",
    installments: inst.numberOfInstallments || "",
    installmentId: inst.installmentId, // required for update
  }));

  Rows(rowData); // Populate child table
};
    
    useEffect(() => {
  const fetchByStudentId = async () => {
    if (paymentData.student_ID) {
      try {
        const res = await fetch(`https://api.test.hachion.co/payments/studentInfo?studentId=${paymentData.student_ID}`);
        const data = await res.json();
        setPaymentData((prev) => ({
          ...prev,
          student_name: data.studentName,
          email: data.emailId,
          mobile: data.mobileNumber,
        }));
        setFilterCourse(data.courses.map((course, i) => ({ id: i, courseName: course })));
      } catch (err) {
        console.error("Error fetching by student ID:", err);
      }
    }
  };
  fetchByStudentId();
}, [paymentData.student_ID]);
useEffect(() => {
  const fetchByEmail = async () => {
    if (paymentData.email) {
      try {
        const res = await fetch(`https://api.test.hachion.co/payments/studentInfo?email=${paymentData.email}`);
        const data = await res.json();
        setPaymentData((prev) => ({
          ...prev,
          student_ID: data.studentId,
          student_name: data.studentName,
          mobile: data.mobileNumber,
        }));
        setFilterCourse(data.courses.map((course, i) => ({ id: i, courseName: course })));
      } catch (err) {
        console.error("Error fetching by email:", err);
      }
    }
  };
  fetchByEmail();
}, [paymentData.email]);

useEffect(() => {
  const fetchByMobile = async () => {
    if (paymentData.mobile) {
      try {
        const res = await fetch(`https://api.test.hachion.co/payments/studentInfo?mobile=${paymentData.mobile}`);
        const data = await res.json();
        setPaymentData((prev) => ({
          ...prev,
          student_ID: data.studentId,
          student_name: data.studentName,
          email: data.emailId,
        }));
        setFilterCourse(data.courses.map((course, i) => ({ id: i, courseName: course })));
      } catch (err) {
        console.error("Error fetching by mobile:", err);
      }
    }
  };
  fetchByMobile();
}, [paymentData.mobile]);
useEffect(() => {
  const fetchCourseFee = async () => {
    if (paymentData.course_name) {
      try {
        const res = await fetch(`https://api.test.hachion.co/payments/courseFee?courseName=${encodeURIComponent(paymentData.course_name)}`);
        const data = await res.json();
        if (data && data.courseFee !== undefined) {
          setPaymentData((prev) => ({
            ...prev,
            course_fee: data.courseFee
          }));
        }
      } catch (error) {
        console.error("Error fetching course fee:", error);
      }
    }
  };

  fetchCourseFee();
}, [paymentData.course_name]);

useEffect(() => {
  axios.get("https://api.test.hachion.co/payments")
    .then((response) => {
      const normalizedData = response.data.map((item) => ({
        id: item.paymentId,
        student_ID: item.studentId,
        student_name: item.studentName,
        email: item.email,
        mobile: item.mobile,
        course_name: item.courseName,
        course_fee: item.courseFee,
        installments: item.noOfInstallments,
        tax: item.tax,
        discount: item.discount,
        days: item.noOfDays,
        total: item.totalAmount,
        balance: item.balancePay,
        date: item.installments?.[0]?.payDate || "", 
        rawInstallments: item.installments, 
      }));
      setOfflinePayment(normalizedData);
      setFilteredPayment(normalizedData);
    })
    .catch((error) => {
      console.error("❌ Failed to fetch payments:", error);
    });
}, []);

useEffect(() => {
  const filteredData = offlinePayment.filter((item) => {
    const date = new Date(item.date); // Assuming 'date' is the created date
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      [
        item.student_ID,
        item.student_name,
        item.email,
        item.mobile,
        item.course_name,
        item.status,
        item.date ? dayjs(item.date).format('MMM-DD-YYYY') : ''
      ]
        .map(field => String(field || '').toLowerCase())
        .some(field => field.includes(term));

    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(new Date(endDate).setHours(23, 59, 59, 999)));

    return matchesSearch && inDateRange;
  });

  setFilteredPayment(filteredData);
}, [searchTerm, startDate, endDate, offlinePayment]);

 const handleChange = async (e) => {
  const { name, value } = e.target;

  const updatedData = {
    ...paymentData,
    [name]: value,
  };
  setPaymentData(updatedData);

  const courseFee = parseFloat(updatedData.course_fee) || 0;
  const tax = parseFloat(updatedData.tax) || 0;
  const discount = parseFloat(updatedData.discount) || 0;
  const count = parseInt(updatedData.installments) || 0;  // user input installments
  const dayGap = parseInt(updatedData.days) || 0;

  const actualTotalFee = Math.round(courseFee + tax - discount);
  const perInstallment = count > 0 ? Math.round(actualTotalFee / count) : 0;

  // Calculate total received from rows
  const totalReceived = rows.reduce((sum, row) => {
    const received = parseFloat(row.received_pay) || 0;
    return sum + received;
  }, 0);

  setPaymentData((prev) => ({
    ...prev,
    total: actualTotalFee,
    balance: Math.max(actualTotalFee - totalReceived, 0),
  }));

    if (name === 'installments' || name === 'days') {
      let count = parseInt(updatedData.installments); 
      const dayGap = parseInt(updatedData.days) || 0;
    
      if (name === 'installments') {
        if (count > 4) {
          setErrorMessage("❌ Maximum 4 installments are allowed.");
          setSuccessMessage("");
          updatedData.installments = "4"; 
          setPaymentData(updatedData);
          count = 4;
        } else {
          setErrorMessage("");
        }
      }
    
      const today = dayjs();
      const updatedRows = [...rows];
    
      // Always keep 4 rows
      for (let i = 0; i < 4; i++) {
        const baseRow = {
          due_date: i < count ? today.add(dayGap * i, 'day').format('DD-MM-YYYY') : '',
          installments: `${i + 1}`,
        };
    
        if (formMode === "Add") {
          updatedRows[i] = {
            ...updatedRows[i],
            ...baseRow,
            actual_pay: i < count ? perInstallment : '',  // reset actual_pay if beyond count
          };
        } else {
          updatedRows[i] = {
            ...updatedRows[i],
            ...baseRow,
            actual_pay: i < count ? (updatedRows[i]?.actual_pay ?? '') : '', // keep existing or empty if beyond count
          };
        }
      }
    
      Rows(updatedRows);
  }


  // if (name === 'installments' || name === 'days') {
  //   const today = dayjs();

  //   // Update only up to `count` rows, clear rest
  //   const updatedRows = rows.map((row, idx) => {
  //     if (idx < count) {
  //       return {
  //         ...row,
  //         due_date: today.add(dayGap * idx, 'day').format('DD-MM-YYYY'),
  //         actual_pay: perInstallment,
  //         installments: `${idx + 1}`,
  //       };
  //     } else {
  //       return {
  //         ...row,
  //         due_date: '',
  //         actual_pay: '',
  //         installments: `${idx + 1}`, // Keep installment number for consistency
  //       };
  //     }
  //   });

  //   Rows(updatedRows);
  // }
};


  // handleRowChange stays the same - update rows only by user
  const handleRowChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedRows = [...rows];

    if (name === 'proof_image') {
      updatedRows[index][name] = files[0]; // File object
    } else {
      updatedRows[index][name] = value;
    }

    Rows(updatedRows);

    const courseFee = parseFloat(paymentData.course_fee) || 0;
    const tax = parseFloat(paymentData.tax) || 0;
    const discount = parseFloat(paymentData.discount) || 0;
    const actualTotalFee = courseFee + tax - discount;

    const totalReceived = updatedRows.reduce((sum, row) => {
      const received = parseFloat(row.received_pay) || 0;
      return sum + received;
    }, 0);

    setPaymentData((prev) => ({
      ...prev,
      total: actualTotalFee,
      balance: Math.max(actualTotalFee - totalReceived, 0),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setErrorMessage("");

  const formData = new FormData();
  const currentDate = new Date().toISOString().split("T")[0];

  const formattedInstallments = rows.map((row) => ({
    payDate: row.pay_date
      ? dayjs(row.pay_date, "DD-MM-YYYY").format("YYYY-MM-DD")
      : "",
    dueDate: row.due_date
      ? dayjs(row.due_date, "DD-MM-YYYY").format("YYYY-MM-DD")
      : "",
    paymentMethod: row.method,
    numberOfInstallments: parseInt(row.installments),
    actualPay: parseFloat(row.actual_pay),
    receivedPay: parseFloat(row.received_pay),
    proof: row.proof_image?.name || "", // filename
    reference: row.reference,
  }));

  const payload = {
    studentId: paymentData.student_ID,
    studentName: paymentData.student_name,
    email: paymentData.email,
    mobile: paymentData.mobile,
    courseName: paymentData.course_name,
    courseFee: parseFloat(paymentData.course_fee),
    tax: parseFloat(paymentData.tax),
    discount: parseFloat(paymentData.discount),
    noOfInstallments: parseInt(paymentData.installments),
    noOfDays: parseInt(paymentData.days),
    totalAmount: parseFloat(paymentData.total),
    balancePay: parseFloat(paymentData.balance),
    installments: formattedInstallments,
    date: currentDate,
  };

  
  formData.append("paymentData", new Blob([JSON.stringify(payload)], { type: "application/json" }));

  
  rows.forEach((row) => {
    if (row.proof_image && typeof row.proof_image !== "string") {
      formData.append("proof", row.proof_image);
    }
  });

  try {
    const response = await axios.post("https://api.test.hachion.co/payments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      setSuccessMessage("✅ Payment added successfully.");
      setErrorMessage("");
    }
  } catch (error) {
    setSuccessMessage("");
    setErrorMessage("❌ Error adding payment. Please try again.");
  }
};
const handleUpdate = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setErrorMessage("");

  if (!selectedPaymentId) {
    setErrorMessage("❌ Cannot update: payment ID is missing.");
    return;
  }

  const formData = new FormData();
  const currentDate = new Date().toISOString().split("T")[0];

  const formattedInstallments = rows.map((row) => ({
    installmentId: row.installmentId,
    payDate: row.pay_date ? dayjs(row.pay_date, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
    dueDate: row.due_date ? dayjs(row.due_date, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
    paymentMethod: row.method,
    numberOfInstallments: parseInt(row.installments),
    actualPay: parseFloat(row.actual_pay),
    receivedPay: parseFloat(row.received_pay),
    proof: typeof row.proof_image === "string" ? row.proof_image : "", 
    reference: row.reference,
  }));

  const payload = {
    studentId: paymentData.student_ID,
    studentName: paymentData.student_name,
    email: paymentData.email,
    mobile: paymentData.mobile,
    courseName: paymentData.course_name,
    courseFee: parseFloat(paymentData.course_fee),
    tax: parseFloat(paymentData.tax),
    discount: parseFloat(paymentData.discount),
    noOfInstallments: parseInt(paymentData.installments),
    noOfDays: parseInt(paymentData.days),
    totalAmount: parseFloat(paymentData.total),
    balancePay: parseFloat(paymentData.balance),
    installments: formattedInstallments,
    date: currentDate,
  };

  formData.append("paymentData", new Blob([JSON.stringify(payload)], { type: "application/json" }));

  // Append file and installmentId only if file is new
  rows.forEach((row) => {
    if (row.proof_image && typeof row.proof_image !== "string") {
      formData.append("proof", row.proof_image);
      formData.append("proofInstallmentId", row.installmentId);
    }
  });

  try {
    const response = await axios.put(`https://api.test.hachion.co/payments/${selectedPaymentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      setSuccessMessage("✅ Payment updated successfully.");
      setErrorMessage("");
    }
  } catch (error) {
    console.error("❌ Update failed:", error);
    setSuccessMessage("");
    setErrorMessage("❌ Error updating payment. Please try again.");
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
<div className="col">
    <label className="form-label">Student ID</label>
    <input
      type="text"
      className="schedule-input"
      name="student_ID"
      value={paymentData.student_ID}
      onChange={(e) => setPaymentData({ ...paymentData, student_ID: e.target.value })}
    />
  </div>
<div class="col">
    <label for="inputEmail4" class="form-label">Student Name</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='student_name' value={paymentData.student_name} onChange={handleChange}/>
  </div>
   <div className="col">
    <label className="form-label">Email</label>
    <input
      type="text"
      className="schedule-input"
      name="email"
      value={paymentData.email}
      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
    />
  </div>
 <div className="col">
    <label className="form-label">Mobile Number</label>
    <input
      type="text"
      className="schedule-input"
      name="mobile"
      value={paymentData.mobile}
      onChange={(e) => setPaymentData({ ...paymentData, mobile: e.target.value })}
    />
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
      <div className="col">
  <label className="form-label">Course Fee</label>
  <input
    type="text"
    className="schedule-input"
    name="course_fee"
    value={paymentData.course_fee}
    onChange={(e) =>
      setPaymentData({ ...paymentData, course_fee: e.target.value })
    }
    
  />
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
                {/* <input
                  className='table-curriculum'
                  name='pay_date'
                  value={curr.pay_date}
                  onChange={(e) => handleRowChange(index, e)}
                /> */}
                <input
  type="date"
  className="table-curriculum"
  name="pay_date"
  value={dayjs(curr.pay_date, 'DD-MM-YYYY').format('YYYY-MM-DD')}
  onChange={(e) => {
    const formattedDate = dayjs(e.target.value).format('DD-MM-YYYY');
    const fakeEvent = {
      target: {
        name: 'pay_date',
        value: formattedDate,
      },
    };
    handleRowChange(index, fakeEvent);
  }}
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
              {/* <StyledTableCell align='center'>
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
              </StyledTableCell> */}
              <StyledTableCell align="center">
  {curr.proof_image ? (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={
          typeof curr.proof_image === 'string'
            ? `https://api.test.hachion.co/payments/download/${encodeURIComponent(curr.proof_image)}`
            : URL.createObjectURL(curr.proof_image)
        }
        alt="proof"
        style={{
          width: 50,
          height: 50,
          cursor: 'pointer',
          objectFit: 'cover',
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
        onClick={() =>
          window.open(
            typeof curr.proof_image === 'string'
              ? `https://api.test.hachion.co/payments/download/${encodeURIComponent(curr.proof_image)}`
              : URL.createObjectURL(curr.proof_image),
            '_blank'
          )
        }
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
        onChange={(e) => handleFileUpload(index, e)} // You already have this
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
      {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
      
    <button className='submit-btn' onClick={handleSubmit}>Save</button>
    <button className='submit-btn' onClick={handleSubmit}>Send to Email</button>
  </>
) : (
  <>
  {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

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
            <StyledTableCell align="center">Status</StyledTableCell>
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
        <StyledTableCell align="center">{curr.status}</StyledTableCell>
        <StyledTableCell align="center">{curr.date ? dayjs(curr.date).format('MMM-DD-YYYY') : ''}</StyledTableCell>
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
    <div style={{ marginTop: "8px", textAlign: "left" }}>
  {successMessage && (
    <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>
  )}
  {errorMessage && (
    <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>
  )}
</div>
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