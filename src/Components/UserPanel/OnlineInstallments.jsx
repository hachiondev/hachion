import './Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer,
TextField, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
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

  const initialValues = {
    name: "",
    email: "",
    number:"",
    country:""
  };

const OnlineInstallments = () => {
const { courseName } = useParams();
const location = useLocation();
const { selectedBatchData,numSelectedInstallments } = location.state || {};  
 const [courseData, setCourseData] = useState({
  ...(selectedBatchData || { courseName })
});
 

console.log("installments initial:", courseData);
  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [paidInstallment, setPaidInstallment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [errorMessageForCoupon, setErrorMessageForCoupon] = useState("");
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const mobileInputRef = useRef(null);
  const summaryRef = useRef(null);
  const [couponCode, setCouponCode] = useState("");
const [appliedDiscount, setAppliedDiscount] = useState(null);

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

      useEffect(() => {
    if (mobileNumber) {
      const dialCodeMatch = countries.find((c) =>
        mobileNumber.replace(/\s+/g, '').startsWith(c.code)
      );
      if (dialCodeMatch) {
        setStudentData((prev) => ({
          ...prev,
          country: dialCodeMatch.name,
        }));
      }
    }
  }, [mobileNumber]);

      useEffect(() => {
        const fetchStudentDetails = async () => {
          const user = JSON.parse(localStorage.getItem('loginuserData'));
          const email = user?.email;
  
          if (!email) return;
  
          try {
            const response = await axios.get('https://api.hachion.co/api/v1/user/students');
            const allStudents = response.data;
  
            const matchedStudent = allStudents.find((student) => student.email === email);
  
            if (matchedStudent) {
              setStudentData(matchedStudent);
              setMobileNumber(matchedStudent.mobile || '');
            }
          } catch (err) {
            
          }
        };
  
        fetchStudentDetails();
      }, []);
      const [selectedCountry, setSelectedCountry] = useState({
                code: '+1',
                flag: 'US',
                name: 'United States',
              });

          const countries = [
      { name: 'India', code: '+91', flag: 'IN' },
      { name: 'United States', code: '+1', flag: 'US' },
      { name: 'United Kingdom', code: '+44', flag: 'GB' },
      { name: 'Thailand', code: '+66', flag: 'TH' },
      { name: 'Canada', code: '+1', flag: 'CA' },
      { name: 'Australia', code: '+61', flag: 'AU' },
      { name: 'Germany', code: '+49', flag: 'DE' },
      { name: 'France', code: '+33', flag: 'FR' },
      { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
      { name: 'Qatar', code: '+974', flag: 'QA' },
      { name: 'Japan', code: '+81', flag: 'JP' },
      { name: 'China', code: '+86', flag: 'CN' },
      { name: 'Russia', code: '+7', flag: 'RU' },
      { name: 'South Korea', code: '+82', flag: 'KR' },
      { name: 'Brazil', code: '+55', flag: 'BR' },
      { name: 'Mexico', code: '+52', flag: 'MX' },
      { name: 'South Africa', code: '+27', flag: 'ZA' },
      { name: 'Netherlands', code: '+31', flag: 'NL' }
    ];

    const defaultCountry = countries.find((c) => c.flag === "US");
        useEffect(() => {
  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();
      const userCountryCode = data?.country_code;
      const matchedCountry = countries.find((c) => c.flag === userCountryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    })
    .catch(() => {});
}, []);

    
        useEffect(() => {
      if (mobileNumber) {
        const dialCodeMatch = countries.find((c) =>
          mobileNumber.replace(/\s+/g, '').startsWith(c.code)
        );
        if (dialCodeMatch) {
          setStudentData((prev) => ({
            ...prev,
            country: dialCodeMatch.name,
          }));
        }
      }
    }, [mobileNumber]);
    
    useEffect(() => {
  if (numSelectedInstallments) {
    setSelectedInstallments(numSelectedInstallments);
  }
}, [numSelectedInstallments]);


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

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, []);
const handlePaymentForRazorPay = async () => {
  try {
    // const amount = Math.round(getField('total'));
    // const amount = Math.round(netPayable);
    const amount = 1.00;
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    
    if (!user || !user.email) {
      setErrorMessage("Please log in before making payment.");
  setSuccessMessage("");
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
      setErrorMessage("Missing required details to proceed with payment.");
        setSuccessMessage("");
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
    couponCode
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
  setErrorMessage("Failed to open Razorpay modal.");
          setSuccessMessage("");
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

const handleApplyCoupon = async () => {
  if (!couponCode) return;

  try {
    const res = await axios.get(
      `https://api.hachion.co/coupon-code/discount/${couponCode}`
    );

    
    if (!res.data || Object.keys(res.data).length === 0) {
      setErrorMessageForCoupon("Invalid coupon code");
      setSuccessMessage("");
      setAppliedDiscount(null);
      return;
    }

    const currentDate = new Date();
    const couponEndDate = new Date(res.data.endDate);
    const allowedCountries = res.data.countries || [];
    const allowedCourses = res.data.courses || [];
    const usageLimit = res.data.usageLimit;
    const numberOfHits = res.data.numberOfHits;

    const userCountryName = selectedCountry?.name;
    if (
      allowedCountries.length > 0 &&
      !allowedCountries.includes(userCountryName)
    ) {
      setErrorMessageForCoupon("Coupon not valid for your country");
      setSuccessMessage("");
      setAppliedDiscount(null);
      return;
    }

    if (couponEndDate < currentDate) {
      setErrorMessageForCoupon("Your coupon is expired");
      setSuccessMessage("");
      setAppliedDiscount(null);
      return;
    }

    if (usageLimit !== null && numberOfHits > usageLimit) {
      setErrorMessageForCoupon("Coupon usage limit has been reached");
      setSuccessMessage("");
      setAppliedDiscount(null);
      return;
    }

    const currentCourse = selectedBatchData?.schedule_course_name;
    if (allowedCourses && !allowedCourses.includes(currentCourse)) {
      setErrorMessageForCoupon("Coupon not applicable for this course");
      setSuccessMessage("");
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount(res.data);
    setErrorMessageForCoupon("");
    setSuccessMessage("Coupon applied successfully!");
  } catch (err) {
    console.error("Invalid coupon", err);
    setErrorMessageForCoupon("Invalid coupon code");
    setSuccessMessage("");
    setAppliedDiscount(null);
  }
};


const disallowedModes = ['crash', 'mentoring', 'self', 'selfqa'];
const courseSlug = courseData?.courseName?.toLowerCase().replace(/\s+/g, '-');
  return (
    <>
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/coursedetails">Courses</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to={`/coursedetails/${courseSlug}`}>{courseData?.courseName} </Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to={`/enroll/${courseSlug}`}>Enroll {courseData?.courseName} </Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Installments {courseData?.courseName} 
            </li>
          </ol>
        </nav>
      </div>

      <div className='enrollment'>
        <p>Enrollment Details</p>
      </div>

      <div className='enrollment-details'>
      <div className='personal-details'>
          <div className='personal-details-header'>
              <p>1. Personal Details</p>
          </div>
        
          <form className='details'>
        <div className='input-row'>
          <div className="col-md-5">
            <label htmlFor="inputName4" className="form-label">
              Full Name<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              
              placeholder='Enter your full name'
              value={studentData?.userName || ''}
              readOnly
              required
            />
          </div>
          <div className="col-md-5">
            <label htmlFor="inputEmail4" className="form-label">
              Email ID<span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              
              placeholder='abc@gmail.com'
              value={studentData?.email || ''}
              readOnly
            />
          </div>
        </div>

        <div className='input-row'>
          <div className="col-md-5">
          <label className="form-label">Mobile Number</label>
          <div className="input-wrapper">
            <input
              type="tel"
              className="form-control"
              ref={mobileInputRef}
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              readOnly
            />
          </div>
        </div>
          <div className="col-md-5"> 
          <label htmlFor="inputCity" className="form-label">
            Country<span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your country"
            value={studentData?.country || ''}
            readOnly
            required
          />
        </div>
        </div>
      </form>
        </div>

{/* <div className="installments-section">
  <label className="installments-label">No. of Installments:</label>
  <div className="installments-options">
    <label>
      <input
        type="radio"
        name="installments"
        value="2"
        checked={numSelectedInstallments === 2}
         onChange={handleInstallmentChange}
        readOnly   
      />{" "}
      2
    </label>
    <label>
      <input
        type="radio"
        name="installments"
        value="3"
        checked={numSelectedInstallments === 3}
         onChange={handleInstallmentChange}
        readOnly   
      />{" "}
      3
    </label>
  </div>
</div> */}

<div className="installments-section">
  <label className="installments-label">No. of Installments:</label>
  <div className="installments-options">
    {numSelectedInstallments === 2 && (
      <label>
        <input
          type="radio"
          name="installments"
          value="2"
          checked={numSelectedInstallments === 2}
          onChange={handleInstallmentChange}
          readOnly
        />{" "}
        2
      </label>
    )}
    {numSelectedInstallments === 3 && (
      <label>
        <input
          type="radio"
          name="installments"
          value="3"
          checked={numSelectedInstallments === 3}
          onChange={handleInstallmentChange}
          readOnly
        />{" "}
        3
      </label>
    )}
  </div>
</div>

        <div className='personal-details'>
          <div className='personal-details-header'>
            <p>2. Installment Details</p>
          </div>
          <div className='details-box'>
            <div className='enroll-table'>
              <TableContainer component={Paper}>
                <Table className="table-details" sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"> </StyledTableCell>
                      <StyledTableCell align="center">Installments</StyledTableCell>
                      <StyledTableCell align="center">Installment Amount</StyledTableCell>
                      <StyledTableCell align="center">Total</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                
    {selectedInstallments > 0 &&
  Array.from({ length: selectedInstallments }).map((_, index) => {
    
    const discountAmount = (Number(courseData.iamount) * Number(courseData.idiscount)) / 100;
const netCourseAmount = Number(courseData.iamount) - discountAmount;
const baseInstallment = netCourseAmount / selectedInstallments;
    const charge = Number(500);
    let displayInstallment = baseInstallment;
    let totalWithCharge = baseInstallment + charge;

    if (appliedDiscount) {
      const { discountType, discountValue } = appliedDiscount;

      if (discountType === "percent") {
        
        const discountAmt = (baseInstallment * discountValue) / 100;
        const discountedInstallment = baseInstallment - discountAmt;
        displayInstallment = discountedInstallment;
        totalWithCharge = discountedInstallment + charge;
      } else if (discountType === "fixed") {
        
        displayInstallment = baseInstallment;
        totalWithCharge = baseInstallment - discountValue + charge;
      }
    }
     return (
      <StyledTableRow key={index}>
        <StyledTableCell align="center">
          <Checkbox
            checked={paidInstallment.includes(index + 1)}
            disabled={paidCheckBoxInstallment.includes(index + 1)}
            onClick={() => handlePayment(index + 1)}
          />
        </StyledTableCell>

        <StyledTableCell align="center">{index + 1}</StyledTableCell>

        <StyledTableCell align="center">
          {currency} {displayInstallment.toFixed(2)}
        </StyledTableCell>

        <StyledTableCell align="center">
          <strong>{currency} {totalWithCharge.toFixed(2)}</strong>
        </StyledTableCell>

        <StyledTableCell align="center">
          <button
            className="apply-btn"
            onClick={() => handlePayment(index + 1)}
          >
            Pay
          </button>
          
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className='coupon-div'>
              <p>Have a coupon code ?</p>
              <div className='coupon'>
              <div className="coupon-input-wrapper">
      <TextField
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => {
    setCouponCode(e.target.value);

    
    if (e.target.value.trim() === "") {
      setErrorMessageForCoupon("");
    }
  }}
        id="filled-start-adornment"
        className="coupon-field"
        variant="filled"
      />

      {/* Error just below input */}
      {errorMessageForCoupon && (
        <p style={{ color: "red", fontSize: "13px", margin: "4px 0 0 0" }}>
          {errorMessageForCoupon}
        </p>
      )}
    </div>
    
    <button className="apply-btn" onClick={handleApplyCoupon}>
      Apply
    </button>
    
          </div>
          </div>
            </div>
          </div>
        </div>
        {paidInstallment.length > 0 && (
  <div className='personal-details' ref={summaryRef}>
    <div className='personal-details-header'>
      <p>3. Installment Order Summary</p>
    </div>
    <div className='details-box'>
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="simple table">
          <TableBody>
            {/* Course Name */}
            <TableRow>
              <TableCell className="table-cell-left">Course Name</TableCell>
              <TableCell align="right" className="table-cell-right">
                {courseName}
              </TableCell>
            </TableRow>

            {/* Installment Fees */}

            {paidInstallment.map((inst) => (
              <TableRow key={inst}>
                <TableCell className="table-cell-left">Installment {inst} Fee</TableCell>
                <TableCell align="right" className="table-cell-right">
                  {/* {currency} {(courseData.iamount / selectedInstallments).toFixed(2)} */}
                  {currency} {(
        (courseData.iamount - (courseData.iamount * courseData.idiscount / 100)) 
        / selectedInstallments
      ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            {/* Processing Fee */}
            <TableRow>
              <TableCell className="table-cell-left">Processing Fee</TableCell>
              <TableCell align="right" className="table-cell-right">
                + {currency} {500}
              </TableCell>
            </TableRow>

            {/* Total before discount */}
            <TableRow>
              <TableCell className="table-cell-left">Total</TableCell>
              <TableCell align="right" className="table-cell-right">
                {currency} {(installmentsSubtotal + 500).toFixed(2)}
              </TableCell>
            </TableRow>

            {/* Discount */}
{/*             
{appliedDiscount && (
  <TableRow>
    <TableCell className="table-cell-left">
      Coupon Discount
      {appliedDiscount.discountType === "percent"
        ? ` (${appliedDiscount.discountValue}%)`
        : ""}
    </TableCell>
    <TableCell align="right" className="table-cell-right">
      - {currency}{" "}
      {appliedDiscount.discountType === "percent"
        ? (
            (courseData.iamount * appliedDiscount.discountValue) /
            100 /
            selectedInstallments *
            paidInstallment.length
          ).toFixed(2)
        : appliedDiscount.discountValue}
    </TableCell>
  </TableRow>
)} */}
{appliedDiscount && !errorMessageForCoupon && (
  <TableRow>
    <TableCell className="table-cell-left">
      {appliedDiscount.discountType === "percent"
        ? `Coupon Discount (${appliedDiscount.discountValue}%)`
        : "Coupon Value"}
    </TableCell>
    <TableCell align="right" className="table-cell-right">
      - {currency}{" "}
      {appliedDiscount.discountType === "percent"
        ? (
            (courseData.iamount * appliedDiscount.discountValue) /
            100 /
            selectedInstallments *
            paidInstallment.length
          ).toFixed(2)
        : appliedDiscount.discountValue}
    </TableCell>
  </TableRow>
)}

            {/* Tax */}
            <TableRow>
              <TableCell className="table-cell-left">Tax</TableCell>
              <TableCell align="right" className="table-cell-right">
                + {currency} {0}
              </TableCell>
            </TableRow>

            {/* Net Payable */}
            <TableRow className="net-amount">
              <TableCell className="net-amount-left">Net Payable Amount</TableCell>
              <TableCell align="right" className="net-amount-right">
                {(() => {
                  const selectedInstallmentsTotal = (courseData.iamount / selectedInstallments) * paidInstallment.length;
                  const totalDiscountPercent = Number(courseData.idiscount) + (appliedDiscount && appliedDiscount.discountType === "percent" ? Number(appliedDiscount.discountValue) : 0);
                  const discountAmount = appliedDiscount
                    ? appliedDiscount.discountType === "percent"
                      ? (selectedInstallmentsTotal * totalDiscountPercent) / 100
                      : (selectedInstallmentsTotal * Number(courseData.idiscount)) / 100 + Number(appliedDiscount.discountValue)
                    : (selectedInstallmentsTotal * Number(courseData.idiscount)) / 100;

                  const netPayable = selectedInstallmentsTotal + 500 - discountAmount + 0; 
                  return `${currency} ${netPayable.toFixed(2)}`;
                })()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
              {/* <div>
                {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
                {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
                <button className="payment-btn" onClick={handlePaymentForRazorPay}>Proceed to Pay</button>
              </div> */}
              <div>
  {successMessage && (
    <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>
      {successMessage}
    </p>
  )}
  {errorMessage && (
    <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
      {errorMessage}
    </p>
  )}

  <button
    className="payment-btn"
    onClick={handlePaymentForRazorPay}
    disabled={!!errorMessage || !!errorMessageForCoupon} 
    style={{
      opacity: errorMessage || errorMessageForCoupon ? 0.6 : 1,
      cursor: errorMessage || errorMessageForCoupon ? "not-allowed" : "pointer",
    }}
  >
    Proceed to Pay
  </button>
</div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default OnlineInstallments;