"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Blogs.css";
import logo from "@/assets/logo.webp";
import paymentsuccess from "@/assets/paymentsuccess.gif";
import { useParams, usePathname, useRouter } from "next/navigation";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import Loader from "./Common/Loader/Loader";
import { getNavState } from "@/lib/navState";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's
// src/Components/UserPanel/EnrollPayment.jsx (/payment/:courseName) — the
// enrollment/payment confirmation + invoice page. react-router's
// useLocation().state -> getNavState(pathname).
const EnrollPayment = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [navState] = useState(() => getNavState(pathname) || {});
  const { selectedBatchData: rawBatchData, modeType, sendEmail, sendWhatsApp, sendText } = navState;
  const loggedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loginuserData") || "null") : null;
  const email = navState?.email || loggedUser?.email || "";

  const [localBatchData] = useState(() => (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("selectedBatchData") || "{}") : {}));
  const selectedBatchData = rawBatchData && Object.keys(rawBatchData).length > 2 ? rawBatchData : localBatchData;
  const [studentData, setStudentData] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const { courseName } = useParams();
  const apiCourseName = useCourseApiName();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoiceMessage, setInvoiceMessage] = useState("");
  const [paymentData, setPaymentData] = useState({
    orderId: "",
    paymentMethod: "",
    paymentDate: "",
  });

  const generateInvoiceNumber = () => {
    if (!paymentData?.id || !paymentData?.paymentDate) return "";
    const courseCode = selectedBatchData.schedule_course_name?.replace(/[^A-Za-z]/g, "").toUpperCase().substring(0, 5);
    const date = new Date(paymentData.paymentDate);
    const datePart = String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + date.getFullYear();
    return `HACH${courseCode}${datePart}-${paymentData.id}`;
  };

  const handleCaptureOrder = async (orderId) => {
    const studentId = localStorage.getItem("studentId");
    const batchId = localStorage.getItem("batchId");
    if (!studentId || !courseName || !batchId) {
      alert("Missing payment info. Please try again.");
      return;
    }
    const batchData = JSON.parse(localStorage.getItem("selectedBatchData")) || {};
    const discount = batchData.discount ?? 0;
    try {
      await axios.post(`${API_BASE_URL}/capture-order`, null, {
        params: { orderId, studentId, courseName, batchId, discount },
      });
      localStorage.removeItem("studentId");
      localStorage.removeItem("courseName");
      localStorage.removeItem("batchId");
      localStorage.removeItem("selectedBatchData");
    } catch (error) {
      console.error("Failed to complete payment", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const orderId = urlParams.get("token");
    if (status === "success" && orderId) {
      handleCaptureOrder(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const res = await axios.get("https://ipinfo.io?token=9da91c409ab4b2");
        const country = res.data.country || "US";
        const currencyMap = { IN: "INR", US: "USD", GB: "GBP", EU: "EUR", AE: "AED", AU: "AUD", CA: "CAD", JP: "JPY", CN: "CNY", TH: "THB", RU: "RUB", BR: "BRL", KR: "KRW", MX: "MXN", SA: "SAR", NL: "EUR", RO: "RON" };
        const userCurrency = currencyMap[country] || "USD";
        setCurrency(userCurrency);
        if (userCurrency !== "USD" && userCurrency !== "INR") {
          const rateRes = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
          const rate = rateRes.data.rates[userCurrency] || 1;
          setExchangeRate(rate);
        }
      } catch (err) {
        console.error("Currency detection failed", err);
        setCurrency("USD");
        setExchangeRate(1);
      }
    };
    detectCurrency();
  }, []);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const user = JSON.parse(localStorage.getItem("loginuserData"));
      const userEmail = user?.email;
      if (!userEmail) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/students`);
        const allStudents = response.data;
        const matchedStudent = allStudents.find((student) => student.email === userEmail);
        if (matchedStudent) {
          setStudentData((prev) => ({ ...prev, ...matchedStudent }));
          setMobileNumber(matchedStudent.mobile || "");
        }
      } catch (err) {
        console.error("Failed to fetch student details", err);
      }
    };
    fetchStudentDetails();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/courses/getByCourseName/${encodeURIComponent(apiCourseName)}`);
        if (response.data && response.data.length > 0) {
          const course = response.data[0];
          const mappedCourse = {
            courseName: course.courseName,
            courseImage: course.courseImage,
            duration: selectedBatchData.duration,
            iamount: course.iamount,
            idiscount: course.idiscount,
          };
          setCourseData(mappedCourse);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCourseName]);

  useEffect(() => {
    if (!email || !selectedBatchData?.schedule_course_name) return;
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/razorpay/getByEmailAndCourse`, {
          params: { email, courseName: selectedBatchData.schedule_course_name, batchId: selectedBatchData.batchId },
        });
        const payment = Array.isArray(response.data) ? response.data[0] : response.data;
        setPaymentData(payment || {});
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPaymentData();
  }, [email, selectedBatchData?.schedule_course_name, selectedBatchData?.batchId]);

  const handleGenerateInvoice = async () => {
    if (isGeneratingInvoice) return;
    try {
      setIsGeneratingInvoice(true);
      setInvoiceMessage("");
      const invoiceNumber = generateInvoiceNumber();
      const netAmount = courseData.iamount - (courseData.iamount * courseData.idiscount) / 100;
      const payload = {
        studentId: studentData?.studentId,
        studentName: studentData?.userName,
        email: studentData?.email,
        mobile: mobileNumber,
        currencyCode: currency,
        courseName: selectedBatchData.schedule_course_name,
        courseFee: courseData?.iamount,
        discount: courseData?.idiscount || 0,
        tax: 0,
        totalAmount: netAmount,
        balancePay: 0,
        status: "PAID",
        invoiceNumber,
        installments: [
          {
            payDate: new Date().toISOString().split("T")[0],
            dueDate: new Date().toISOString().split("T")[0],
            actualPay: netAmount,
            receivedPay: netAmount,
            paymentMethod: paymentData.paymentMethod || "ONLINE",
          },
        ],
      };
      await axios.post(`${API_BASE_URL}/payments/generateInvoiceForOnline`, payload);
      setInvoiceMessage("✅ Invoice has been sent to your email.");
    } catch (err) {
      console.error(err);
      setInvoiceMessage("❌ Failed to generate invoice. Please try again.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  if (loading || !studentData) {
    return <Loader />;
  }
  if (!courseData) {
    return <p>No course found</p>;
  }
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };
  return (
    <>
      <div className="enrollpayment">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt="logo" className="enrollpayment-logo" />
        <p>Enrollment Confirmation</p>
      </div>
      <div className="enrollment-details">
        <div className="input-row">
          <div>
            <button className="EnrollPay-outline-btn" onClick={handleGenerateInvoice} disabled={isGeneratingInvoice}>
              {isGeneratingInvoice ? "Generating Invoice..." : "Download Invoice"}
            </button>
            {invoiceMessage && <p style={{ color: "#28a745", marginTop: "8px", fontSize: "14px" }}>{invoiceMessage}</p>}
          </div>
          <div>
            <button className="EnrollPay-btn" onClick={() => router.push("/userdashboard")}>
              {" "}
              Go to Dashboard{" "}
            </button>
          </div>
        </div>
        <div className="personal-details">
          <div className="personal-details-header">
            <p>1. Payment Confirmation</p>
          </div>
          <div className="payment-success-section">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={paymentsuccess.src} alt="Payment Successful" className="payment-success-gif" />
            <h3>Payment Successful!</h3>
            <p>You have successfully enrolled in the course.</p>
          </div>
        </div>
        <div className="details-row">
          <div className="Pay-details">
            <div className="personal-details-header">
              <p>2. Student Details</p>
            </div>
            <div className="details-box">
              <div className="pay-row">
                <span className="detail-label">Full Name :</span>
                <span className="detail-value">{studentData?.userName || ""}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Email ID :</span>
                <span className="detail-value">{studentData?.email || ""}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Mobile Number :</span>
                <span className="detail-value">{mobileNumber}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Country :</span>
                <span className="detail-value">{studentData?.country || ""}</span>
              </div>
            </div>
          </div>

          <div className="Pay-details">
            <div className="personal-details-header">
              <p>3. Course Details</p>
            </div>
            <div className="details-box">
              <div className="pay-row">
                <span className="detail-label">Course Name :</span>
                <span className="detail-value">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${API_BASE_URL}/${courseData.courseImage}`} alt="" style={{ width: "40px", height: "40px", marginRight: "10px" }} />
                  {selectedBatchData.schedule_course_name || courseData?.courseName || "—"}
                </span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Trainer : </span>
                <span className="detail-value"> {selectedBatchData.trainer_name || selectedBatchData.trainer || "—"}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Duration : </span>
                <span className="detail-value">{courseData.duration}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Mode : </span>
                <span className="detail-value">{selectedBatchData.schedule_mode || selectedBatchData.mode || "—"}</span>
              </div>
              <div className="pay-row">
                <span className="detail-label">Batch Start Date : </span>
                <span className="detail-value">
                  {formatDate(selectedBatchData.schedule_date || selectedBatchData.date)} @ {selectedBatchData.schedule_time || selectedBatchData.time}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="personal-details">
          <div className="personal-details-header">
            <p>4. Payment summary</p>
          </div>
          <div className="details-box">
            <div className="pay-row">
              <span className="summary-label">Order ID :</span>
              <span className="detail-value">{paymentData.orderId}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">Payment Method :</span>
              <span className="detail-value">{paymentData.paymentMethod}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">Payment Date :</span>
              <span className="detail-value">{paymentData.paymentDate}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">Course Fee :</span>
              <span className="detail-value">{courseData?.iamount ?? "0"}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">Discount(%) :</span>
              <span className="detail-value">{courseData.idiscount}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">GST(18%) :</span>
              <span className="detail-value">{0}</span>
            </div>
            <div className="pay-row">
              <span className="summary-label">Total :</span>
              <span className="detail-value">{(courseData.iamount - (courseData.iamount * courseData.idiscount) / 100).toFixed(2)}</span>
            </div>
            <TableRow className="net-amount">
              <TableCell className="net-amount-left">Net Payable amount:</TableCell>
              <TableCell align="right" className="net-amount-right">
                {(courseData.iamount - (courseData.iamount * courseData.idiscount) / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          </div>
        </div>
        <div className="details-row" style={{ textAlign: "center" }}>
          <p>
            A confirmation email has been sent to : <strong>{studentData?.email || ""}</strong>
          </p>
        </div>
        <div className="input-row">
          <div className="go-home">
            <Link href="/" className="EnrollPay-outline-btn">
              Go to Home
            </Link>
          </div>
          <div>
            <Link href="/courses" className="EnrollPay-btn">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default EnrollPayment;
