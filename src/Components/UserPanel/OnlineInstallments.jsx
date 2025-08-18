import React, { useState, useRef } from 'react';
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
    discount: 10,
    tax: 0,
  };

  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [paidInstallment, setPaidInstallment] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const summaryRef = useRef(null);

  const handleInstallmentChange = (e) => {
    setSelectedInstallments(Number(e.target.value));
    setPaidInstallment([1]);
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

  const perInstallment = selectedInstallments > 0 ? courseData.amount / selectedInstallments : 0;
  const countChosen = paidInstallment.length;

  const installmentsSubtotal = perInstallment * countChosen;

  const chargesOneTime = countChosen > 0 ? Number(courseData.charge) : 0;

  const totalBeforeDiscount = installmentsSubtotal + chargesOneTime;

  const discountAmount = installmentsSubtotal * (courseData.discount / 100);
  const discounted = installmentsSubtotal - discountAmount;

  const taxAmount = courseData.tax / perInstallment;
  const netPayable = discounted + chargesOneTime + taxAmount;

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
                      <StyledTableCell align="center"> </StyledTableCell>
                      <StyledTableCell align="center">Installments</StyledTableCell>
                      <StyledTableCell align="center">Installment Amount</StyledTableCell>
                      <StyledTableCell align="center">Total</StyledTableCell>
                      {/* <StyledTableCell align="center">Action</StyledTableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInstallments > 0 &&
                      Array.from({ length: selectedInstallments }).map((_, index) => {
                        const installmentAmount = Number(perInstallment);

                        // IMPORTANT: Do NOT add charges here (they are one-time per transaction)
                        const installmentTotal = (installmentAmount + chargesOneTime);

                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">
                              <Checkbox
                                checked={paidInstallment.includes(index + 1)}
                                onClick={() => handlePayment(index + 1)}
                              />
                            </StyledTableCell>
                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                            <StyledTableCell align="center">
                              {currency} {installmentAmount.toFixed(2)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <strong>{currency} {installmentTotal.toFixed(2)}</strong>
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
        {paidInstallment.length > 0 && (
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

                    {/* Only show the clicked installments */}
                    {paidInstallment.map((inst) => (
                      <TableRow key={inst}>
                        <TableCell className="table-cell-left">Installment {inst} Fee</TableCell>
                        <TableCell align="right" className="table-cell-right">
                          {currency} {perInstallment.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell className="table-cell-left">Charges (one-time)</TableCell>
                      <TableCell align="right" className="table-cell-right">
                        + {currency} {chargesOneTime.toFixed(2)}
                      </TableCell>
                    </TableRow>

                    {/* Total before discount & tax */}
                    <TableRow>
                      <TableCell className="table-cell-left">Total</TableCell>
                      <TableCell align="right" className="table-cell-right">
                        {currency} {totalBeforeDiscount.toFixed(2)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="table-cell-left">
                        Discount ({courseData.discount}%)
                      </TableCell>
                      <TableCell align="right" className="table-cell-right">
                        - {currency} {discountAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="table-cell-left">
                        Tax
                      </TableCell>
                      <TableCell align="right" className="table-cell-right">
                        + {currency} {(courseData.tax).toFixed(2)}
                      </TableCell>
                    </TableRow>

                    {/* Net Payable */}
                    <TableRow className="net-amount">
                      <TableCell className="net-amount-left">Net Payable Amount</TableCell>
                      <TableCell align="right" className="net-amount-right">
                        {currency} {netPayable.toFixed(2)}
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