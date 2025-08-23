
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import StickyBar from './StickyBar';
import Footer from './Footer';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useLocation, useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


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

const RequestInstallment = ({ selectedBatchData } ) => {
    const { courseName } = useParams();
 const location = useLocation();
 const [courseData, setCourseData] = useState(
    selectedBatchData || {
      courseName: courseName || "React JS Fundamentals",
      amount: 15000,
      charge: 500,
      discount: 200,
      tax: 200,
    }
  );

console.log("installments initial:", courseData);
  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [paidInstallment, setPaidInstallment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const summaryRef = useRef(null);
const [paidCheckBoxInstallment, setPaidCheckBoxInstallment] = useState([]);
 useEffect(() => {
    const fetchCoursePricing = async () => {
      try {
        if (!selectedBatchData?.schedule_course_name) return;
        const response = await axios.get("https://api.hachion.co/courses/all");
        const matchedCourse = response.data.find(
          (c) =>
            c.courseName.toLowerCase().replace(/\s+/g, '-') ===
            selectedBatchData.schedule_course_name
              ?.toLowerCase()
              .replace(/\s+/g, '-')
        );

        if (matchedCourse) {
          
          setCourseData({
            ...selectedBatchData,
            iamount: matchedCourse.iamount || 0,
            idiscount: matchedCourse.idiscount || 0,
            charge: matchedCourse.charge || 0,
            tax: matchedCourse.tax || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching course pricing:", err);
      }
    };

    fetchCoursePricing();
  }, [selectedBatchData]);

  const handleInstallmentChange = (e) => {
    setSelectedInstallments(Number(e.target.value));
    setPaidInstallment([]);
  };

const handlePayment = (installmentNo) => {
  setPaidInstallment((prev) => {
    if (prev.includes(installmentNo)) {
      return prev.filter(i => i !== installmentNo);
    } else {
      return [...prev, installmentNo];
    }
  });

  if (summaryRef.current) {
    summaryRef.current.scrollIntoView({ behavior: "smooth" });
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

const handlePaymentForRazorPay = async () => {
  try {
    // const amount = Math.round(getField('total'));
    // const amount = Math.round(netPayable);
    const amount = 1.00;
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    
    if (!user || !user.email) {
      alert("Please log in before making payment.");
      return;
    }
    const userEmail = user.email;
    const profileResponse = await axios.get("https://api.hachion.co/api/v1/user/myprofile", {
      params: { email: userEmail }
    });

    const studentId = profileResponse.data?.studentId;
    const mobile = profileResponse.data?.mobile || '';
    const batchId = selectedBatchData?.batchId;
    const courseName = selectedBatchData?.schedule_course_name;
    if (!studentId || !batchId || !courseName) {
      alert("Missing required details to proceed with payment.");
      return;
    }

    localStorage.setItem("studentId", studentId);
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("batchId", batchId);
    localStorage.setItem("selectedBatchData", JSON.stringify({
      ...selectedBatchData,
      discount: courseData?.discount ?? 0 
    }));

    const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    const returnUrl = `https://hachion.co/enroll/${slug}`;
    
    if (mobile.startsWith('+91')) {

      const orderRes = await axios.post("https://api.hachion.co/razorpay/create-razorpay-order", null, {
        params: { amount }
      });

      const razorpayOrder = orderRes.data;
      const razorpayOrderId = razorpayOrder.id;
      const options = {
        key: "rzp_live_1g4Axfq4KHi3kl",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Hachion",
        description: `Payment for ${courseName}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            const captureRes = await axios.post("https://api.hachion.co/razorpay/capture-razorpay-installments", null, {
              params: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                studentId,
                courseName,
                batchId,
                
                numSelectedInstallments: selectedInstallments,
    checkboxClicked: paidInstallment.length,
              }
            });

            setSuccessMessage("✅ " + captureRes.data);
setErrorMessage("");
          } catch (error) {
            console.error("❌ Error capturing Razorpay payment:", error);
const errMsg = error?.response?.data || "❌ Payment verification failed.";
setErrorMessage(errMsg);
setSuccessMessage("");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: mobile.replace('+91', '')
        },
        theme: {
          color: "#3399cc"
        }
      };

     try {
  const rzp = new window.Razorpay(options);
  rzp.open();
} catch (err) {
  alert("Failed to open Razorpay modal.");
}
    } else {
      const paypalRes = await axios.post("https://api.hachion.co/create-order", null, {
        params: {
          amount,
          returnUrl
        }
      });
      const approvalUrl = paypalRes.data;
      if (approvalUrl.startsWith("https://www.paypal.com")) {
        window.location.href = approvalUrl;
      } else {
        setErrorMessage("❌ Unexpected PayPal response.");
setSuccessMessage("");
      }
    }
} catch (error) {
  if (error instanceof Error) {
  } else if (typeof error === "object" && error !== null) {
  } else {
  }
    setErrorMessage("❌ Failed to start payment.");
setSuccessMessage("");
  }
};
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
     <div className="installment-modal-overlay">
      <div className="installment-modal-content">
        <div className="request-batch">
          <div className="request-header">
        <p>Installments Request</p>
      </div>

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
    const baseInstallment = Number(courseData.iamount) / selectedInstallments;
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
        {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
        {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button className="payment-btn" >Submit Request</button>
      </div>
      </div>
      </div>
      </div>
      </div>
    </>
  );
};
export default RequestInstallment;