
import './Blogs.css';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useLocation, useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiCloseCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d3d3d3',
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.black,
    border: `1px solid ${theme.palette.common.grey}`,
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

const RequestInstallment = ({ 
  selectedBatchData, 
  closeModal, 
  onInstallmentChange, 
  courseFee, 
  email, 
  studentId, 
  studentName,
  courseData,
  mobile
}) => {
    const { courseName } = useParams();
      const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
 const location = useLocation();
 const modalRef = useRef(null);


   console.log("selectedBatchData:", selectedBatchData);
    console.log("courseFee:", courseFee);
    console.log("email:", email);
    console.log("studentId:", studentId);
    console.log("studentName:", studentName);
    console.log("courseData:", courseData);
    console.log("mobile (from parent):", mobile);

    
    console.log("localStorage studentId:", localStorage.getItem("studentId"));
    console.log("localStorage courseName:", localStorage.getItem("courseName"));
    console.log("localStorage batchId:", localStorage.getItem("batchId"));
    console.log("localStorage selectedBatchData:", localStorage.getItem("selectedBatchData"));
    console.log("localStorage loginuserData:", localStorage.getItem("loginuserData"));

const handleSubmitRequest = async () => {
  try {
    // studentId;
    // studentName;
    const payerEmail = email;
    // mobile;
    const batchId = selectedBatchData?.batchId;
    const courseName = selectedBatchData?.courseName || courseData.courseName;

    if (!studentId || !courseName || !batchId) {
      setErrorMessage("Missing required student or course info.");
      return;
    }

    const requestData = {
      studentId,
      studentName,
      payerEmail,
      mobile,
      courseName,
      batchId,
      courseFee: courseData.iamount,
      numSelectedInstallments: selectedInstallments,
    };  
      
    const response = await axios.post(
      "https://api.hachion.co/razorpay/installment-request",
      requestData
    );

    if (response.status === 200) {
      setSuccessMessage(
        "Your installment request has been submitted successfully. Once it is approved, you will receive an email notification."
      );
      setErrorMessage("");
      setTimeout(() => {
        navigate(`/coursedetails/${courseName.toLowerCase().replace(/\s+/g, "-")}`);
      }, 5000);
    } else {
      setErrorMessage("Failed to submit installment request. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting installment request:", error);
    setErrorMessage(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }
};

useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal(); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

console.log("installments initial:", courseData);
  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [paidInstallment, setPaidInstallment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const summaryRef = useRef(null);
const [paidCheckBoxInstallment, setPaidCheckBoxInstallment] = useState([]);

  const handleInstallmentChange = (e) => {
  const value = Number(e.target.value);
  setSelectedInstallments(value);
  setPaidInstallment([]);
  if (onInstallmentChange) {
    onInstallmentChange(value); 
  }
};
  const currency = "₹";

  const perInstallment = selectedInstallments > 0 ? courseData.iamount / selectedInstallments : 0;
  const countChosen = paidInstallment.length;

  const installmentsSubtotal = perInstallment * countChosen;
  const chargesOneTime = countChosen > 0 ? Number(courseData.charge) : 0;
  const totalBeforeDiscount = installmentsSubtotal + chargesOneTime;
const discountValue = Number(courseData.idiscount ?? 0);   
const discountAmount = countChosen > 0 
  ? (installmentsSubtotal * discountValue / 100) 
  : 0;

const discounted = installmentsSubtotal - discountAmount;

const taxAmount = Number(courseData.tax ?? 0); 
const netPayable = discounted + 500 + taxAmount;

 useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const courseName = localStorage.getItem("courseName");
    const batchId = localStorage.getItem("batchId");

    if (!studentId || !courseName || !batchId) return;

    axios.get("https://api.hachion.co/razorpay/checkbox-status", {
      params: { studentId, courseName, batchId }
    })
    .then(res => {
      
      const disabledArray = Array.from({ length: res.data }, (_, i) => i + 1);
      setPaidCheckBoxInstallment(disabledArray);
    })
    .catch(err => console.error("Error fetching checkbox status:", err));
  }, []);

const disallowedModes = ['crash', 'mentoring', 'self', 'selfqa'];
const courseSlug = courseData?.courseName?.toLowerCase().replace(/\s+/g, '-');
  return (
    <>
     <div className="installment-modal-overlay" onClick={closeModal}>
      <div className="installment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="request-batch">
          <div className="request-header">
        <p>Installments Request</p>
      </div>
      <AiOutlineCloseCircle onClick={closeModal} className="button-close" />

      <div className='enrollment-details'>
        {/* Installments Selection */}
        <div className="installments-section">
          <label className="installments-label">Select no. of Installments:</label>
          <div className="installments-options">
            <label>
              <input 
                type="radio" 
                name="installments" 
                value="2" 
                onChange={handleInstallmentChange} 
              /> 2 Installments
            </label>
            <label>
              <input 
                type="radio" 
                name="installments" 
                value="3" 
                onChange={handleInstallmentChange} 
              /> 3 Installments
            </label>
          </div>
        </div>

        <div className='personal-details'>
          <div className='personal-details-header'>
            <p>1. Installment Details</p>
          </div>
          <div className='details-box'>
            <div className='enroll-table'>
              <TableContainer component={Paper}>
                <Table className="table-details" sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Installments</StyledTableCell>
                      <StyledTableCell align="center">Installment Amount</StyledTableCell>
                      <StyledTableCell align="center">Total</StyledTableCell>
                      {/* <StyledTableCell align="center">Action</StyledTableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                 {selectedInstallments > 0 &&
  Array.from({ length: selectedInstallments }).map((_, index) => {
    const baseInstallment = Number(courseData.itotal) / selectedInstallments;
    const totalWithCharge = baseInstallment + 500;
    
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                            <StyledTableCell align="center">
          {currency} {baseInstallment.toFixed(2)}
        </StyledTableCell>
        <StyledTableCell align="center">
          <strong>{currency} {totalWithCharge.toFixed(2)}</strong>
        </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button className="payment-btn" onClick={handleSubmitRequest}>
          Submit Request
        </button>
      </div>

      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: 10, textAlign: "center" }}>
          {successMessage}
        </p>
      )}
      </div>

      {showModal && (
                  <div
                    className="modal"
                    style={{ display: "block" }}
                    onClick={() => {
                      setShowModal(false);
                      closeModal(false);
                    }}
                  >
                    <div
                      className="modal-dialog"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="have-modal-content" id="#querymodal">
                        <button
                          className="close-btn"
                          aria-label="Close"
                          onClick={() => {
                            setShowModal(false);
                            closeModal(false);
                          }}
                        >
                          <RiCloseCircleLine />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
      </div>
      </div>
      </div>
    </>
  );
};
export default RequestInstallment;