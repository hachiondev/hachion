"use client";

import "../../Blogs.css";
import { styled } from "@mui/material/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { API_BASE_URL } from "@/lib/apiBase";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.black,
    border: `1px solid ${theme.palette.common.grey}`,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Ported from the CRA app's
// src/Components/UserPanel/EnrollmentPage/components/RequestInstallment.jsx.
// useNavigate -> useRouter.
const RequestInstallment = ({ selectedBatchData, closeModal, onInstallmentChange, courseFee, email, studentId, studentName, courseData, mobile, currencyLabel }) => {
  useParams();
  const [selectedInstallments, setSelectedInstallments] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);
  const router = useRouter();

  const handleSubmitRequest = async () => {
    try {
      const payerEmail = email;
      const batchId = selectedBatchData?.batchId;
      const courseName = selectedBatchData?.courseName || courseData?.courseName;
      if (!studentId || !courseName || !batchId) {
        setErrorMessage("Missing required student or course info.");
        return;
      }
      if (!selectedInstallments) {
        setErrorMessage("Please select number of installments.");
        return;
      }
      const requestData = {
        studentId,
        studentName,
        payerEmail,
        mobile,
        courseName,
        batchId,
        courseFee: courseFee,
        numSelectedInstallments: selectedInstallments,
      };
      const response = await axios.post(`${API_BASE_URL}/razorpay/installment-request`, requestData);
      if (response.status === 200) {
        setSuccessMessage("Your installment request has been submitted successfully. Once it is approved, you will receive an email notification.");
        setErrorMessage("");
        setTimeout(() => {
          router.push(`/courses/${courseName.toLowerCase().replace(/\s+/g, "-")}`);
        }, 5000);
      } else {
        setErrorMessage("Failed to submit installment request.");
      }
    } catch (error) {
      console.error("Installment API error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
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

  const handleInstallmentChange = (e) => {
    const value = Number(e.target.value);
    setSelectedInstallments(value);
    if (onInstallmentChange) {
      onInstallmentChange(value);
    }
  };

  return (
    <div className="installment-modal-overlay" onClick={closeModal}>
      <div className="installment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="request-batch">
          <div className="request-header">
            <p>Installments Request</p>
          </div>
          <AiOutlineCloseCircle onClick={closeModal} className="button-close" />

          <div className="enrollment-details">
            <div className="installments-section">
              <label className="installments-label">Select no. of Installments:</label>
              <div className="installments-options">
                <label>
                  <input type="radio" name="installments" value="2" onChange={handleInstallmentChange} /> 2 Installments
                </label>
                <label>
                  <input type="radio" name="installments" value="3" onChange={handleInstallmentChange} /> 3 Installments
                </label>
              </div>
            </div>

            <div className="personal-details">
              <div className="personal-details-header">
                <p>1. Installment Details</p>
              </div>
              <div className="details-box">
                <div className="enroll-table">
                  <TableContainer component={Paper}>
                    <Table className="table-details" sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Installments</StyledTableCell>
                          <StyledTableCell align="center">Installment Amount</StyledTableCell>
                          <StyledTableCell align="center">Total</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInstallments > 0 &&
                          Array.from({ length: selectedInstallments }).map((_, index) => {
                            const totalCourseFee = Number(courseFee);
                            const baseInstallment = selectedInstallments > 0 ? totalCourseFee / selectedInstallments : 0;
                            const installmentCharge = Number(courseData?.charge || 500);
                            const totalWithCharge = baseInstallment + installmentCharge;
                            return (
                              <StyledTableRow key={index}>
                                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                                <StyledTableCell align="center">
                                  {currencyLabel} {Math.round(baseInstallment)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <strong>
                                    {currencyLabel} {Math.round(totalWithCharge)}
                                  </strong>
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <button className="payment-btn" onClick={handleSubmitRequest}>
                Submit Request
              </button>
            </div>

            {successMessage && (
              <p style={{ color: "green", fontWeight: "bold", marginTop: 10, textAlign: "center" }}>{successMessage}</p>
            )}
            {errorMessage && <p style={{ color: "red", fontWeight: "bold", marginTop: 10, textAlign: "center" }}>{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RequestInstallment;
