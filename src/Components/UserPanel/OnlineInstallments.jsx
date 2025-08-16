import React, { useState, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import StickyBar from './StickyBar';
import Footer from './Footer';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const OnlineInstallments = () => {
  const courseData = {
    courseName: "React JS Fundamentals",
    amount: 15000,
    charge: 500,
    discount: 200,
    tax: 200,
  };

  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [paidInstallment, setPaidInstallment] = useState(null); // ✅ Track which installment is paid
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const summaryRef = useRef(null);

  const handleInstallmentChange = (e) => {
    setSelectedInstallments(Number(e.target.value));
    setPaidInstallment(null); // reset when installments are changed
  };

  const handlePayment = (installmentNo) => {
    setPaidInstallment(installmentNo);
    setErrorMessage("");

    if (summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currency = "₹";

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/coursedetails">Courses</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to={`/coursedetails/react-js-fundamentals`}>{courseData.courseName}</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link to={`/enroll/react-js-fundamentals`}>Enroll {courseData.courseName}</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Installments {courseData.courseName}
            </li>
          </ol>
        </nav>
      </div>

      <div className='enrollment'>
        <p>Go with Installments</p>
      </div>

      <div className='enrollment-details'>
        {/* Installments Selection */}
        <div className="installments-section">
          <label className="installments-label">No. of Installments:</label>
          <div className="installments-options">
            <label>
              <input 
                type="radio" 
                name="installments" 
                value="2" 
                onChange={handleInstallmentChange} 
              /> 2
            </label>
            <label>
              <input 
                type="radio" 
                name="installments" 
                value="3" 
                onChange={handleInstallmentChange} 
              /> 3
            </label>
          </div>
        </div>

        {/* Installment Table */}
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
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInstallments > 0 &&
                      Array.from({ length: selectedInstallments }).map((_, index) => {
                        const installmentAmount = Number(courseData.amount / selectedInstallments);
                        const installmentTotal = installmentAmount + Number(courseData.charge);

                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                            <StyledTableCell align="center">
                              {currency} {installmentAmount.toFixed(2)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <strong>{currency} {installmentTotal.toFixed(2)}</strong>
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
            </div>
          </div>
        </div>

        {/* Order Summary (only for selected installment) */}
        {paidInstallment && (
        <div className='personal-details' ref={summaryRef}>
            <div className='personal-details-header'>
            <p>2. Installment Order Summary</p>
            </div>
            <div className='details-box'>
            <TableContainer component={Paper} className="table-container">
                <Table aria-label="simple table">
                <TableBody>
                    <TableRow>
                    <TableCell className="table-cell-left">Course Name</TableCell>
                    <TableCell align="right" className="table-cell-right">
                        {courseData.courseName}
                    </TableCell>
                    </TableRow>

                    {/* Only show the clicked installment */}
                    <TableRow>
                    <TableCell className="table-cell-left">
                        Installment {paidInstallment} Fee
                    </TableCell>
                    <TableCell align="right" className="table-cell-right">
                        {currency} {(courseData.amount / selectedInstallments).toFixed(2)}
                    </TableCell>
                    </TableRow>

                    <TableRow>
                    <TableCell className="table-cell-left">Charges</TableCell>
                    <TableCell align="right" className="table-cell-right">
                        + {currency} {courseData.charge}
                    </TableCell>
                    </TableRow>

                    {/* Total = installment amount + charges */}
                    <TableRow>
                    <TableCell className="table-cell-left">Total</TableCell>
                    <TableCell align="right" className="table-cell-right">
                        {currency} {(
                        (courseData.amount / selectedInstallments) + Number(courseData.charge)
                        ).toFixed(2)}
                    </TableCell>
                    </TableRow>

                    <TableRow>
                    <TableCell className="table-cell-left">Discount</TableCell>
                    <TableCell align="right" className="table-cell-right">
                        - {currency} {(courseData.discount / selectedInstallments).toFixed(2)}
                    </TableCell>
                    </TableRow>

                    <TableRow>
                    <TableCell className="table-cell-left">Tax</TableCell>
                    <TableCell align="right" className="table-cell-right">
                        + {currency} {(courseData.tax / selectedInstallments).toFixed(2)}
                    </TableCell>
                    </TableRow>

                    {/* Net Payable = total - discount + tax */}
                    <TableRow className="net-amount">
                    <TableCell className="net-amount-left">Net Payable Amount</TableCell>
                    <TableCell align="right" className="net-amount-right">
                        {currency}{" "}
                        {(
                        (courseData.amount / selectedInstallments) + 
                        Number(courseData.charge) - 
                        (courseData.discount / selectedInstallments) + 
                        (courseData.tax / selectedInstallments)
                        ).toFixed(2)}
                    </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            <div>
                {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
                {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
                <button className="payment-btn" onClick={() => alert("Proceeding to Payment Gateway")}>
                Proceed to Pay
                </button>
            </div>
            </div>
        </div>
        )}
      </div>

      <Footer />
      <StickyBar />
    </>
  );
};

export default OnlineInstallments;