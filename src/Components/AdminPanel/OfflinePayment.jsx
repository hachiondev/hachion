import React, { useEffect } from 'react';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import { countries as staticCountries } from '../../countryUtils';
dayjs.extend(customParseFormat);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0',
  },
}));

const ReminderSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#00AEEF',
    '&:hover': {
      backgroundColor: 'rgba(0, 174, 239, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#00AEEF',
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
  const [filterCourse, setFilterCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [offlinePayment, setOfflinePayment] = useState([]);
  const [filteredPayment, setFilteredPayment] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rows, Rows] = useState([]);
  const [formMode, setFormMode] = useState("Add");
  const isEditMode = formMode === "Edit";
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [lastModifiedInstallmentId, setLastModifiedInstallmentId] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [courseAmounts, setCourseAmounts] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [reminderEnabled, setReminderEnabled] = useState(true); 
  const [cadRate, setCadRate] = useState(1);
  const [inrRate, setInrRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceSent, setIsInvoiceSent] = useState(false);
  const [paymentData, setPaymentData] = useState({
    id: "",
    student_ID: "",
    student_name: "",
    email: "",
    mobile: "",
    course_name: "",
    course_fee: "",
    tax: "",
    discount: "",
    installments: "",
    days: "",
    pay_date: "",
    due_date: "",
    method: "",
    actual_pay: "",
    received_pay: "",
    reference: "",
    total: "",
    balance: "",
    status: "",
    invoiceNumber: "",
    date: currentDate,
    selectedInstallmentId: null,
    reminderEnabled: true,
    currency: "",
  });
  
  const allowedCurrencies = [
  { label: "India (INR)", value: "INR" },
  { label: "United States (USD)", value: "USD" },
  { label: "Canada (CAD)", value: "CAD" }
];
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
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

  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(payment => payment.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      
      if (newSelectedIds.length === displayedCourse.length) {
        setSelectAll(true);
      }
    }
  };

  
  useEffect(() => {
    const allCurrentPageIds = displayedCourse.map(payment => payment.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one payment to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'payment' : 'payments'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        
        const deletePromises = selectedIds.map(id => 
          axios.delete(`https://api.test.hachion.co/payments/${id}`)
        );
        
        await Promise.all(deletePromises);

    
        const updatedPayments = offlinePayment.filter(item => !selectedIds.includes(item.id));
        setOfflinePayment(updatedPayments);
        setFilteredPayment(updatedPayments);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'payment' : 'payments'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting payments:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some payments. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedRows = [...rows];
    updatedRows[index].proof_image = file;
    Rows(updatedRows);
  };
  useEffect(() => {

  const requiredFieldsFilled =
    paymentData.student_ID?.trim() &&
    paymentData.student_name?.trim() &&
    paymentData.email?.trim() &&
    paymentData.mobile?.trim() &&
    paymentData.course_name?.trim() &&
    paymentData.currency?.trim() &&
    parseInt(paymentData.installments) > 0 &&
    !isNaN(parseInt(paymentData.days));

  // Find first incomplete row
  const firstIncompleteIndex = rows.findIndex(
    (row) => !isRowComplete(row)
  );

  // If all rows complete
  const activeIndex =
    firstIncompleteIndex === -1
      ? rows.length
      : firstIncompleteIndex;

  // Previous row must be complete
  // const canSave =
  //   activeIndex > 0 &&
  //   isRowComplete(rows[activeIndex - 1]);

  // setIsSaveDisabled(
  //   !requiredFieldsFilled || !canSave
  // );
  // ✅ Check only enabled installment rows
// ✅ Check only allowed installment rows
const enabledRows = rows.filter(
  (_, index) => index < parseInt(paymentData.installments || 0)
);

// ✅ At least one installment row should be completed
const hasAtLeastOneCompletedRow =
  enabledRows.some((row) => isRowComplete(row));

// ✅ Enable Save/Update once first row completed
setIsSaveDisabled(
  !requiredFieldsFilled || !hasAtLeastOneCompletedRow
);

}, [paymentData, rows]);

 const parentFieldsFilled =
  paymentData.student_ID?.trim() &&
  paymentData.student_name?.trim() &&
  paymentData.email?.trim() &&
  paymentData.mobile?.trim() &&
  paymentData.course_name?.trim() &&
  paymentData.currency?.trim() &&
  paymentData.tax !== "" &&
  paymentData.discount !== "";
  
const isSendInvoiceDisabled = !parentFieldsFilled;
  useEffect(() => {
    if (rows.length === 0) {
      const today = dayjs();
      const defaultRows = Array.from({ length: 4 }, (_, idx) => ({
        pay_date: idx === 0 ? today.format('MMM-DD-YYYY') : '',
        due_date: '',
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
      return;
    }
    try {
      const response = await axios.delete(`https://api.test.hachion.co/payments/${id}`);

      if (response.status === 200) {
        setSuccessMessage("✅ Payment deleted successfully.");
        setErrorMessage("");

        setFilteredPayment((prev) => prev.filter((item) => item.id !== id));
        setOfflinePayment((prev) => prev.filter((item) => item.id !== id));
        
        
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      } else {
        setSuccessMessage("");
        setErrorMessage("❌ Failed to delete payment.");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Something went wrong while deleting the payment.");
    }
  };

  const handleClickOpen = (row) => {
    setFormMode("Edit");
    setShowAddCourse(true);
    setSelectedPaymentId(row.id);

    setInvoiceNumber(row.invoiceNumber || "");

    
const reminderStatus = row.reminderEnabled === false ? false : true;
setReminderEnabled(reminderStatus);

    // setPaymentData({
    //   student_ID: row.student_ID || "",
    //   student_name: row.student_name || "",
    //   email: row.email || "",
    //   mobile: row.mobile || "",
    //   course_name: row.course_name || "",
    //   currency: row.currency || "",
    //   course_fee: row.course_fee || "",
    //   tax: row.tax || 0,
    //   discount: row.discount || 0,
    //   installments: row.installments || "",
    //   days: row.days || "",
    //   total: row.total || "",
    //   balance: row.balance ?? "",
    //   status: row.status ?? "",
    //   reminderEnabled: reminderStatus
    // });
// ✅ Calculate latest balance from installments during Edit Open
const totalReceived = (row.rawInstallments || []).reduce(
  (sum, inst) => sum + (parseFloat(inst.receivedPay) || 0),
  0
);

const latestBalance =
  (parseFloat(row.total) || 0) - totalReceived;

setPaymentData({
  student_ID: row.student_ID || "",
  student_name: row.student_name || "",
  email: row.email || "",
  mobile: row.mobile || "",
  course_name: row.course_name || "",
  currency: row.currency || "",
  course_fee: row.course_fee || "",
  tax: row.tax || 0,
  discount: row.discount || 0,
  installments: row.installments || "",
  days: row.days || "",
  total: row.total || "",
  balance: latestBalance,
  status: row.status ?? "",
  reminderEnabled: reminderStatus
});
    const rowData = (row.rawInstallments || []).map((inst) => ({
      pay_date: inst.payDate ? dayjs(inst.payDate).format("MMM-DD-YYYY") : "",
      due_date: inst.dueDate ? dayjs(inst.dueDate).format("MMM-DD-YYYY") : "",
      method: inst.paymentMethod || "",
      actual_pay: inst.actualPay || "",
      received_pay: inst.receivedPay || "",
      proof_image: inst.proof ? inst.proof.split('/').pop() : "",
      reference: inst.reference || "",
      installments: inst.numberOfInstallments || "",
      installmentId: inst.installmentId,
    }));

    Rows(rowData);
  };

const handleReminderToggle = async (event) => {
  const checked = event.target.checked;

  
  setReminderEnabled(checked);
  setPaymentData(prev => ({
    ...prev,
    reminderEnabled: checked
  }));

  
  const stopReminderValue = checked ? "start" : "stop";

  try {
    
    const response = await axios.put(
      "https://api.test.hachion.co/payments/stop-reminder",
      {
        stopReminder: stopReminderValue,
        courseName: paymentData.course_name,
        studentId: paymentData.student_ID,
        email: paymentData.email
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

   if (response.data?.success) {
  setSuccessMessage(`✅ Reminder ${stopReminderValue} successfully.`);
  await fetchPayments();

  // setShowAddCourse(false);

  setErrorMessage("");
} else {
      setErrorMessage("⚠️ Failed to update reminder status.");
      setSuccessMessage("");
    }
  } catch (error) {
    console.error("Error updating reminder status:", error);
    setErrorMessage("❌ Error updating reminder status.");
    setSuccessMessage("");
  }
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
        const res = await fetch(
          `https://api.test.hachion.co/payments/courseFee?courseName=${encodeURIComponent(paymentData.course_name)}`
        );
        const data = await res.json();

        if (data) {
          setCourseAmounts(data); // store API result
        }
      } catch (error) {
        console.error("Error fetching course fee:", error);
      }
    }
  };

  fetchCourseFee();
}, [paymentData.course_name]);

// useEffect(() => {
//   if (!courseAmounts) return;

//   // 🔴 If no currency → clear fee
//   if (!paymentData.currency) {
//     setPaymentData(prev => ({ ...prev, course_fee: "" }));
//     return;
//   }
// let finalAmount = "";

// if (paymentData.currency === "INR") {
//   finalAmount = courseAmounts.inrAmount;
// } 
// else if (paymentData.currency === "USD") {
//   finalAmount = courseAmounts.usdAmount;
// } 
// else if (paymentData.currency === "CAD") {
//   console.log("Currency:", paymentData.currency);
// // console.log("Exchange Rate:", exchangeRate);
// console.log("USD Amount:", courseAmounts.usdAmount);
//   // Only CAD needs conversion from USD
//   // finalAmount = Math.round(courseAmounts.usdAmount * exchangeRate);
//    finalAmount = Math.round(courseAmounts.usdAmount * cadRate);
  
// }

//   setPaymentData((prev) => ({
//     ...prev,
//     course_fee: finalAmount
//   }));

// }, [paymentData.currency, cadRate, courseAmounts]);

useEffect(() => {

  if (!courseAmounts) return;

  // 🔴 If no currency → clear fee
  if (!paymentData.currency) {

    setPaymentData(prev => ({
      ...prev,
      course_fee: ""
    }));

    return;
  }

  let finalAmount = "";

  if (paymentData.currency === "INR") {

    finalAmount = courseAmounts.inrAmount;

  } else if (paymentData.currency === "USD") {

    finalAmount = courseAmounts.usdAmount;

  } else if (paymentData.currency === "CAD") {

    finalAmount = Math.round(courseAmounts.usdAmount * cadRate);

  }

  // 🔥 Recalculate totals
  const tax = parseFloat(paymentData.tax) || 0;
  const discount = parseFloat(paymentData.discount) || 0;

  const totalAmount =
    parseFloat(finalAmount || 0) + tax - discount;

  const installmentCount =
    parseInt(paymentData.installments) || 1;

  const perInstallment =
    Math.round(totalAmount / installmentCount);

  // 🔥 Update rows actual pay
  const updatedRows = rows.map((row, index) => ({
    ...row,
    actual_pay:
  row.actual_pay !== "" &&
  row.actual_pay !== undefined
    ? row.actual_pay
    : index < installmentCount
    ? perInstallment
    : ""
  }));

  Rows(updatedRows);

  // 🔥 Update payment data
  setPaymentData((prev) => ({
    ...prev,
    course_fee: finalAmount,
    total: totalAmount,
    balance:
  formMode === "Edit"
    ? prev.balance
    : totalAmount
  }));

}, [
  paymentData.currency,
  cadRate,
  courseAmounts,
  paymentData.tax,
  paymentData.discount,
  paymentData.installments
]);

useEffect(() => {

  const fetchExchangeRates = async () => {

    try {

      const res = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );

      const cad = res.data?.rates?.CAD;
      const inr = res.data?.rates?.INR;

      if (cad) {
        setCadRate(cad);
      }

      if (inr) {
        setInrRate(inr);
      }

      console.log("CAD Rate:", cad);
      console.log("INR Rate:", inr);

    } catch (error) {

      console.error("Error fetching exchange rates:", error);

    }
  };

  fetchExchangeRates();

}, []);
const fetchPayments = async () => {
  try {

    const response = await axios.get("https://api.test.hachion.co/payments");

    const normalizedData = response.data.map((item) => ({
      id: item.paymentId,
      student_ID: item.studentId,
      student_name: item.studentName,
      email: item.email,
      mobile: item.mobile,
      course_name: item.courseName,
      currency: item.currency,
      course_fee: item.courseFee,
      installments: item.noOfInstallments,
      tax: item.tax,
      discount: item.discount,
      days: item.noOfDays,
      total: item.totalAmount,
      balance: item.balancePay,
      date: item.installments?.[0]?.payDate || "",
      rawInstallments: item.installments,
      invoiceNumber: item.invoiceNumber,
      status: item.status,

      reminderEnabled: item.stopReminder === "stop" ? false : true
    }));

    setOfflinePayment(normalizedData);
    setFilteredPayment(normalizedData);

  } catch (error) {

    console.error("❌ Failed to fetch payments:", error);

  }
};

useEffect(() => {
  fetchPayments();
}, []);

  useEffect(() => {
    const filteredData = offlinePayment.filter((item) => {
      const date = new Date(item.date);
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
    const count = parseInt(updatedData.installments) || 0;
    const dayGap = parseInt(updatedData.days) || 0;

    const actualTotalFee = Math.round(courseFee + tax - discount);
    const perInstallment = count > 0 ? Math.round(actualTotalFee / count) : 0;

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
      // let count = parseInt(updatedData.installments);
      let count = parseInt(updatedData.installments);

if (!count || count <= 0) {
  count = 1;
  updatedData.installments = "1";
  setPaymentData(updatedData);
}
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
    for (let i = 0; i < 4; i++) {

  const isAllowedRow = i < count;

  updatedRows[i] = {

    ...updatedRows[i],

    due_date: isAllowedRow
      ? today.add(dayGap * i, 'day').format('MMM-DD-YYYY')
      : "",

    installments: `${i + 1}`,

    actual_pay: isAllowedRow
      ? perInstallment
      : "",

    // 🔥 Clear disabled rows automatically
    pay_date: isAllowedRow
      ? updatedRows[i]?.pay_date || (i === 0 ? today.format('MMM-DD-YYYY') : "")
      : "",

    method: isAllowedRow
      ? updatedRows[i]?.method || ""
      : "",

    received_pay: isAllowedRow
      ? updatedRows[i]?.received_pay || ""
      : "",

    proof_image: isAllowedRow
      ? updatedRows[i]?.proof_image || ""
      : "",

    reference: isAllowedRow
      ? updatedRows[i]?.reference || ""
      : "",

    disabled: !isAllowedRow
  };
}

      Rows(updatedRows);
    }
  };
useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [successMessage]);

useEffect(() => {
  if (errorMessage) {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [errorMessage]);

const isRowComplete = (row) => {

  return (
    row.pay_date?.toString().trim() !== "" &&
    row.method?.toString().trim() !== "" &&
    row.received_pay?.toString().trim() !== ""
  );

};

  const handleRowChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedRows = [...rows];

   
    if (name === 'proof_image') {

  updatedRows[index][name] = files[0];

} else if (name === "pay_date" || name === "due_date") {

  // Regex format validation
  const dateRegex = /^[A-Za-z]{0,3}(-?\d{0,2})?(-?\d{0,4})?$/;

  // Stop invalid typing immediately
  if (!dateRegex.test(value)) {
    return;
  }

  // Limit max length
  if (value.length > 12) {
    return;
  }

  updatedRows[index][name] = value;

  if (value.length === 12) {

    const isValidDate = dayjs(
      value,
      "MMM-DD-YYYY",
      true
    ).isValid();

    if (!isValidDate) {
      setErrorMessage(
        `❌ Invalid ${name === "pay_date" ? "Pay Date" : "Due Date"}`
      );
    } else {
      setErrorMessage("");
    }
  } else {
    setErrorMessage("");
  } 
} else {

  // ✅ Only allow numbers and decimals
  if (name === "received_pay") {

    const numberRegex = /^\d*\.?\d*$/;

    // Block characters immediately
    if (!numberRegex.test(value)) {
      return;
    }

    // Prevent multiple dots
    const dotCount = (value.match(/\./g) || []).length;

    if (dotCount > 1) {
      return;
    }
  }

  // ✅ Allow typing only one installment row at a time
  if (
    ["pay_date", "method", "received_pay", "reference", "proof_image"].includes(name)
  ) {

    if (index > 0) {

      const previousRow = updatedRows[index - 1];

      const isPreviousFilled =
        previousRow.pay_date?.toString().trim() !== "" &&
        previousRow.method?.toString().trim() !== "" &&
        previousRow.received_pay?.toString().trim() !== "";

      if (!isPreviousFilled) {

        setErrorMessage(
          `❌ Please complete Installment ${index} before filling Installment ${index + 1}`
        );

        return;
      }
    }
  }

  updatedRows[index][name] = value;
  // 🔥 Auto adjust actual pay based on received pay
if (name === "received_pay") {

  const receivedAmount = parseFloat(value) || 0;

  // Current actual pay
  const currentActualPay =
    parseFloat(updatedRows[index].actual_pay) || 0;

  // Remaining difference
  const difference =
    currentActualPay - receivedAmount;

  // Set current row actual pay same as received pay
  updatedRows[index].actual_pay = receivedAmount;

  // Total installments selected
  const totalInstallments =
    parseInt(paymentData.installments || 0);

  // Remaining rows count
  const remainingRows =
    totalInstallments - (index + 1);

  // Distribute remaining amount
  if (remainingRows > 0 && difference !== 0) {

    const splitAmount =
      difference / remainingRows;

    for (
      let i = index + 1;
      i < totalInstallments;
      i++
    ) {

      const nextActual =
        parseFloat(updatedRows[i].actual_pay) || 0;

      updatedRows[i].actual_pay =
        Math.round(nextActual + splitAmount);
    }
  }
}
}

    Rows(updatedRows);

    if (name === 'pay_date' || name === 'received_pay') {
      const modifiedInstallmentId = updatedRows[index]?.installmentId;
      if (modifiedInstallmentId) {
        setLastModifiedInstallmentId(modifiedInstallmentId);
      }
    }
    // const courseFee = parseFloat(paymentData.course_fee) || 0;
    // const tax = parseFloat(paymentData.tax) || 0;
    // const discount = parseFloat(paymentData.discount) || 0;
    // const actualTotalFee = courseFee + tax - discount;

    // const totalReceived = updatedRows.reduce((sum, row) => {
    //   const received = parseFloat(row.received_pay) || 0;
    //   return sum + received;
    // }, 0);

    // setPaymentData((prev) => ({
    //   ...prev,
    //   total: actualTotalFee,
    //   balance: Math.max(actualTotalFee - totalReceived, 0),
    // }));
    // ✅ Stable balance calculation for Edit Mode
const totalAmount =
  parseFloat(paymentData.total) || 0;

const totalReceived = updatedRows.reduce((sum, row) => {
  return sum + (parseFloat(row.received_pay) || 0);
}, 0);

setPaymentData((prev) => ({
  ...prev,
  balance: Math.max(totalAmount - totalReceived, 0),
}));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    const currentDate = new Date().toISOString().split("T")[0];

    const formattedInstallments = rows.map((row, index) => ({
      payDate: row.pay_date ? dayjs(row.pay_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
      paymentMethod: row.method,
      numberOfInstallments: parseInt(row.installments),
      actualPay: parseFloat(row.actual_pay),
      receivedPay: parseFloat(row.received_pay),
      proof: row.proof_image?.name || "",
      reference: row.reference,
    }));

    
    const payload = {
      studentId: paymentData.student_ID,
      studentName: paymentData.student_name,
      email: paymentData.email,
      mobile: paymentData.mobile,
      courseName: paymentData.course_name,
      currency: paymentData.currency,
      courseFee: parseFloat(paymentData.course_fee),
      tax: parseFloat(paymentData.tax),
      discount: parseFloat(paymentData.discount),
      noOfInstallments: parseInt(paymentData.installments),
      noOfDays: parseInt(paymentData.days),
      totalAmount: parseFloat(paymentData.total),
      balancePay: parseFloat(paymentData.balance),
      installments: formattedInstallments,
      date: currentDate,
      reminderEnabled: reminderEnabled
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
        setSelectedPaymentId(response.data.paymentId);
        setInvoiceNumber(response.data.invoiceNumber);
        setIsSaved(true);
await fetchPayments();
// setShowAddCourse(false);
        if (response.data.invoiceNumber) {
          setInvoiceNumber(response.data.invoiceNumber);
        } else {
          console.warn("⚠️ No invoice number in update response");
        }
      }
    } catch (error) {
    console.error("❌ Error:", error);
    // Use the error message from the backend if it exists
    const serverMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    setErrorMessage(`❌ ${serverMessage}`);
}
  };

const handleDateFilter = async () => {

  const filtered = offlinePayment.filter((item) => {
    const itemDate = dayjs(item.date);

    return (
      (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
      (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
    );
  });

  setFilteredPayment(filtered);

  // SUMMARY API CALL
  try {

    const start = dayjs(startDate).format("YYYY-MM-DD");
    const end = dayjs(endDate).format("YYYY-MM-DD");

    const response = await axios.get(
      `https://api.test.hachion.co/payments/payment-summary?startDate=${start}&endDate=${end}`
    );

    setSummaryData(response.data);

  } catch (error) {
    console.error("Error fetching payment summary:", error);
  }
};

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredPayment(offlinePayment);
  };

  const handleSendToEmail = async (e) => {
    e.preventDefault();

    if (!selectedPaymentId) {
      setErrorMessage("❌ Please save the payment before sending the invoice.");
      return;
    }

    const selectedInstallmentId = lastModifiedInstallmentId || rows[0]?.installmentId;

    const totalReceivedPay = rows.reduce((sum, row) => {
      const received = parseFloat(row.received_pay);
      return sum + (isNaN(received) ? 0 : received);
    }, 0);

    const invoicePayload = {
      paymentId: selectedPaymentId,
      invoiceNumber: invoiceNumber,
      studentName: paymentData.student_name,
      email: paymentData.email,
      mobile: paymentData.mobile,
      balancePay: parseFloat(paymentData.balance),
      courseName: paymentData.course_name,
       currency: paymentData.currency,
      courseFee: parseFloat(paymentData.course_fee),
      discount: parseFloat(paymentData.discount),
      tax: parseFloat(paymentData.tax),
      totalAmount: parseFloat(paymentData.total),
      status: parseFloat(paymentData.balance) === 0 ? "PAID" : "PARTIALLY PAID",
      selectedInstallmentId: selectedInstallmentId,
      installments: rows.map((row) => ({
        installmentId: row.installmentId,
        payDate: row.pay_date ? dayjs(row.pay_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
        dueDate: row.due_date ? dayjs(row.due_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
        receivedPay: totalReceivedPay
      })),
    };

    try {
      await axios.post("https://api.test.hachion.co/payments/generateInvoice", invoicePayload);
      setSuccessMessage("📩 Invoice generated and sent to email.");
    } catch (err) {
      console.error("❌ Invoice generation failed:", err);
      setErrorMessage("❌ Failed to generate invoice. Try again.");
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
      payDate: row.pay_date ? dayjs(row.pay_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
      dueDate: row.due_date ? dayjs(row.due_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
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
      currency: paymentData.currency,
      courseFee: parseFloat(paymentData.course_fee),
      tax: parseFloat(paymentData.tax),
      discount: parseFloat(paymentData.discount),
      noOfInstallments: parseInt(paymentData.installments),
      noOfDays: parseInt(paymentData.days),
      totalAmount: parseFloat(paymentData.total),
      balancePay: parseFloat(paymentData.balance),
      installments: formattedInstallments,
      date: currentDate,
      reminderEnabled: reminderEnabled
    };

    formData.append("paymentData", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    rows.forEach((row) => {
      if (row.proof_image && typeof row.proof_image !== "string") {
        formData.append("proof", row.proof_image);
        formData.append("proofInstallmentId", row.installmentId);
      }
    });

    const updatedRow = rows.find(
      (row) =>
        row.pay_date?.trim() !== "" ||
        (row.received_pay !== undefined && row.received_pay !== null && row.received_pay !== "")
    );
    const selectedInstallmentId = updatedRow?.installmentId || rows[0]?.installmentId;

    setPaymentData((prev) => ({
      ...prev,
      selectedInstallmentId: selectedInstallmentId,
    }));
    
    try {
      const response = await axios.put(`https://api.test.hachion.co/payments/${selectedPaymentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("✅ Payment updated successfully.");
        setErrorMessage("");
        setSelectedPaymentId(response.data.paymentId);
        setInvoiceNumber(response.data.invoiceNumber);
        setIsSaved(true);
        await fetchPayments();

// setShowAddCourse(false);
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Error updating payment. Please try again.");
    }
  };

  const handleSendReminder = async () => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      if (!invoiceNumber) {
        setErrorMessage("❌ Invoice number missing. Please update/save payment first.");
        return;
      }
      const reminderPayload = {
        email: paymentData.email,
        studentName: paymentData.student_name,
        courseName: paymentData.course_name,
        invoiceNumber: invoiceNumber,
        balancePay: parseFloat(paymentData.balance),
        currency: paymentData.currency,
        totalAmount: parseFloat(paymentData.total),
        reminderEnabled: reminderEnabled
      };

      const response = await axios.post("https://api.test.hachion.co/payments/reminder", reminderPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("✅ Reminder sent successfully.");
        await fetchPayments();
      } else {
        setErrorMessage("⚠️ Reminder not sent.");
      }
    } catch (error) {
      setErrorMessage("❌ Failed to send reminder.");
    }
  };

  const handleSaveAndSendInvoice = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double execution

  setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    const currentDate = new Date().toISOString().split("T")[0];

    const formattedInstallments = rows.map((row) => ({
      payDate: row.pay_date ? dayjs(row.pay_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
      dueDate: row.due_date ? dayjs(row.due_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
      paymentMethod: row.method,
      numberOfInstallments: parseInt(row.installments),
      actualPay: parseFloat(row.actual_pay),
      receivedPay: parseFloat(row.received_pay),
      proof: row.proof_image?.name || "",
      reference: row.reference,
    }));

    
    const payload = {
      studentId: paymentData.student_ID,
      studentName: paymentData.student_name,
      email: paymentData.email,
      mobile: paymentData.mobile,
      courseName: paymentData.course_name,
      currency: paymentData.currency,
      courseFee: parseFloat(paymentData.course_fee),
      tax: parseFloat(paymentData.tax),
      discount: parseFloat(paymentData.discount),
      noOfInstallments: parseInt(paymentData.installments),
      noOfDays: parseInt(paymentData.days),
      totalAmount: parseFloat(paymentData.total),
      balancePay: parseFloat(paymentData.balance),
      installments: formattedInstallments,
      date: currentDate,
      reminderEnabled: reminderEnabled
    };

    formData.append("paymentData", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    rows.forEach((row) => {
      if (row.proof_image && typeof row.proof_image !== "string") {
        formData.append("proof", row.proof_image);
      }
    });

    try {
      const saveResponse = await axios.post("https://api.test.hachion.co/payments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (saveResponse.status === 200 || saveResponse.status === 201) {
        const paymentId = saveResponse.data.paymentId;
        const invoiceNumber = saveResponse.data.invoiceNumber;
        setSuccessMessage("✅ Payment added successfully.");
        setSelectedPaymentId(paymentId);
        setInvoiceNumber(invoiceNumber);
        setIsSaved(true);

        const selectedInstallmentId = lastModifiedInstallmentId || rows[0]?.installmentId;
        const totalReceivedPay = rows.reduce((sum, row) => {
          const received = parseFloat(row.received_pay);
          return sum + (isNaN(received) ? 0 : received);
        }, 0);

        const invoicePayload = {
          paymentId,
          invoiceNumber,
          studentName: paymentData.student_name,
          email: paymentData.email,
          mobile: paymentData.mobile,
          balancePay: parseFloat(paymentData.balance),
          courseName: paymentData.course_name,
          currency: paymentData.currency,
          courseFee: parseFloat(paymentData.course_fee),
          discount: parseFloat(paymentData.discount),
          tax: parseFloat(paymentData.tax),
          totalAmount: parseFloat(paymentData.total),
          status: parseFloat(paymentData.balance) === 0 ? "PAID" : "PARTIALLY PAID",
          selectedInstallmentId: selectedInstallmentId,
          installments: rows.map((row) => ({
            installmentId: row.installmentId,
            payDate: row.pay_date ? dayjs(row.pay_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
            dueDate: row.due_date ? dayjs(row.due_date, "MMM-DD-YYYY").format("YYYY-MM-DD") : "",
            receivedPay: totalReceivedPay,
          })),
        };

        await axios.post("https://api.test.hachion.co/payments/generateInvoice", invoicePayload);
        setSuccessMessage("📩 Invoice generated and sent to email.");
        setIsInvoiceSent(true);
        await fetchPayments();
        setIsLoading(false);
        setShowAddCourse(false);
      }
   } catch (error) {
    console.error("❌ Error:", error);
    // Use the error message from the backend if it exists
    const serverMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    setErrorMessage(`❌ ${serverMessage}`);
}
  };
  const handleAddTrendingCourseClick = () => {

  setSuccessMessage("");
  setErrorMessage("");

  setIsSaved(false);
  setIsInvoiceSent(false);
  setIsLoading(false);

  setSelectedPaymentId(null);
  setInvoiceNumber("");
  setLastModifiedInstallmentId(null);

  setReminderEnabled(true);

  setPaymentData({
    id: "",
    student_ID: "",
    student_name: "",
    email: "",
    mobile: "",
    course_name: "",
    course_fee: "",
    tax: "",
    discount: "",
    installments: "",
    days: "",
    pay_date: "",
    due_date: "",
    method: "",
    actual_pay: "",
    received_pay: "",
    reference: "",
    total: "",
    balance: "",
    status: "",
    invoiceNumber: "",
    date: currentDate,
    selectedInstallmentId: null,
    reminderEnabled: true,
    currency: "",
  });

  const today = dayjs();

  Rows(
    Array.from({ length: 4 }, (_, idx) => ({
      pay_date: idx === 0 ? today.format('MMM-DD-YYYY') : '',
      due_date: '',
      method: '',
      actual_pay: '',
      received_pay: '',
      proof_image: '',
      reference: '',
      installments: `${idx + 1}`,
      installmentId: undefined,
    }))
  );

  setFormMode("Add");
  setShowAddCourse(true);
};
  return (
    <>
      {showAddCourse ? (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => {
                  setShowAddCourse(false);
                  setIsLoading(false);
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
              <p style={{ marginBottom: 0 }}>{formMode === "Edit" ? "Edit Payment" : "Add Payment"}</p>
            </div>
            <div className='course-details'>
              <div className='course-row'>
                <div className="col">
                  <label className="form-label">Student ID <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="schedule-input"
                    name="student_ID"
                    value={paymentData.student_ID}
                    onChange={(e) => setPaymentData({ ...paymentData, student_ID: e.target.value })}
                     disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
                  />
                </div>
                <div class="col">
                  <label for="inputEmail4" class="form-label">Student Name <span style={{ color: "red" }}>*</span></label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='student_name' value={paymentData.student_name} onChange={handleChange}  disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}/>
                
                </div>
                <div className="col">
                  <label className="form-label">Email <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="schedule-input"
                    name="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                   disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
                  />
                </div>
                <div className="col">
                  <label className="form-label">Mobile Number <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="schedule-input"
                    name="mobile"
                    value={paymentData.mobile}
                    onChange={(e) => setPaymentData({ ...paymentData, mobile: e.target.value })}
                     disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
                  />
                </div>
              </div>
              <div className='course-row'>
                <div className="col">
                  <label htmlFor="course" className="form-label">Course Name <span style={{ color: "red" }}>*</span></label>
                  <select
                    id="course"
                    className="form-select"
                    name="course_name"
                    value={paymentData.course_name}
                    onChange={handleChange}
                     disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
                  >
                    <option value="" disabled>Select Course <span style={{ color: "red" }}>*</span></option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>
                {/* Currency Dropdown */}
<div className="col">
  <label className="form-label">Currency <span style={{ color: "red" }}>*</span></label>
 <select
  className="form-select"
  name="currency"
  value={paymentData.currency}
  onChange={handleChange}
   disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
>
  <option value="">Select Currency</option>
  {allowedCurrencies.map((c, index) => (
    <option key={index} value={c.value}>
      {c.label}
    </option>
  ))}
</select>
</div>
                <div className="col">
                  <label className="form-label">Course Fee <span style={{ color: "red" }}>*</span></label>
                  <input
  type="text"
  className="schedule-input"
  name="course_fee"
  value={paymentData.course_fee}
  readOnly
  placeholder="Select currency first"
   disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}
/>
                </div>

                <div class="col">
                  <label for="inputEmail4" class="form-label">TAX <span style={{ color: "red" }}>*</span></label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='tax' value={paymentData.tax} onChange={handleChange}  disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }}/>
                </div>
                <div class="col">
                  <label for="inputEmail4" class="form-label">Discount <span style={{ color: "red" }}>*</span></label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='discount' value={paymentData.discount} onChange={handleChange}  disabled={isEditMode}
  style={{
    backgroundColor: isEditMode ? "#e9ecef" : "",
    cursor: isEditMode ? "not-allowed" : "text"
  }} />
                </div>
                <div class="col">
                  <label for="inputEmail4" class="form-label">No. of installments <span style={{ color: "red" }}>*</span></label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='installments' value={paymentData.installments} onChange={handleChange} />
                </div>
                <div class="col">
                  <label for="inputEmail4" class="form-label">Instalment Days <span style={{ color: "red" }}>*</span></label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='days' value={paymentData.days} onChange={handleChange} />
                </div>
              </div>

              {/* REMINDER TOGGLE - SHOW ONLY IN EDIT MODE */}
              {formMode === "Edit" && (
                <div className='course-row' style={{ marginTop: '15px', marginBottom: '15px', alignItems: 'center' }}>
                  <div className="col" style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <ReminderSwitch
                          checked={reminderEnabled}
                          onChange={handleReminderToggle}
                          name="reminderSwitch"
                          color="primary"
                        />
                      }
                      label={
                        <span style={{ 
                          fontWeight: '500', 
                          color: reminderEnabled ? '#00AEEF' : '#666',
                          marginLeft: '5px'
                        }}>
                          Reminder {reminderEnabled ? 'START' : 'STOP'}
                        </span>
                      }
                      labelPlacement="end"
                    />
                  </div>
                </div>
              )}

              <div className='course-row' style={{ marginTop: 5 }}>
                <button
                  className='filter'
                  onClick={handleSendReminder}
                  disabled={!invoiceNumber}

                  style={{
                    backgroundColor: isSaveDisabled ? "#ccc" : "#007bff",
                    color: isSaveDisabled ? "#666" : "#fff",
                    opacity: isSaveDisabled ? 1 : 1,
                    cursor: isSaveDisabled ? "not-allowed" : "pointer",
                    pointerEvents: isSaveDisabled ? "none" : "auto",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                >
                  Send Reminder
                </button>

               <button
  className='filter'
  // onClick={handleSaveAndSendInvoice}
  onClick={
  formMode === "Edit"
    ? handleSendToEmail
    : handleSaveAndSendInvoice
}
  // Disable if it's loading, already sent, or other conditions met
  disabled={isSendInvoiceDisabled || isLoading || isInvoiceSent}
  style={{
    backgroundColor: (isSendInvoiceDisabled || isLoading || isInvoiceSent) ? "#ccc" : "#007bff",
    color: (isSendInvoiceDisabled || isLoading || isInvoiceSent) ? "#666" : "#fff",
    opacity: 1,
    cursor: (isSendInvoiceDisabled || isLoading || isInvoiceSent) ? "not-allowed" : "pointer",
    pointerEvents: (isSendInvoiceDisabled || isLoading || isInvoiceSent) ? "none" : "auto",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
  }}
>
  {isLoading ? (
    "Sending..."
  ) : isInvoiceSent ? (
    <>✅ Sent Invoice</>
  ) : (
    "Send Invoice"
  )}
</button>
              </div>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, marginTop: 2 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align='center' sx={{ fontSize: '14px' }}>
  Pay Date <span style={{ color: "red" }}>*</span>
</StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Due Date</StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}> Payment Method <span style={{ color: "red" }}>*</span></StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Instalment</StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Actual Pay <span style={{ color: "red" }}>*</span></StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Received Pay <span style={{ color: "red" }}>*</span></StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Proof</StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: '14px' }}>Reference</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((curr, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align='center'>
  <StyledTableCell align='center'>
  <input
    type="text"
    className="table-curriculum"
    name="pay_date"
    placeholder="MMM-DD-YYYY"
    value={curr.pay_date || ""}
   disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
 cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
    onChange={(e) => handleRowChange(index, e)}
  />
</StyledTableCell>
</StyledTableCell>
                     <StyledTableCell align='center'>
  <input
    type="text" // Permanent text type, no more calendar popup
    className='table-curriculum'
    name='due_date'
    placeholder="MMM-DD-YYYY"
    
    // Displays the date in the format: May-14-2026
    value={
      curr.due_date 
        
    }
disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
  cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
    onChange={(e) => {
      const val = e.target.value;
      
      const fakeEvent = {
        target: {
          name: 'due_date',
          value: val, 
        },
      };
      handleRowChange(index, fakeEvent);
    }}
  />
</StyledTableCell>
                        <StyledTableCell align='center'>
                          <select
                            className='table-curriculum'
                            name='method'
                            value={curr.method}
                        disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
 cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
                            onChange={(e) => handleRowChange(index, e)}
                          >
                            <option value=''>Select</option>
                            <option value='Bank payment'>Bank payment</option>
                            <option value='paypal'>PayPal</option>
                            <option value='venmo'>Venmo</option>
                            <option value='zelle'>Zelle</option>
                            <option value='other'>Other</option>
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
                         disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
  cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
                            onChange={(e) => handleRowChange(index, e)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <input
                            className='table-curriculum'
                            name='received_pay'
                            value={curr.received_pay}
                           disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
 cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
                            onChange={(e) => handleRowChange(index, e)}
                          />
                        </StyledTableCell>

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
                            <label
  style={{
    cursor:
      index >= parseInt(paymentData.installments || 0) ||
      (
        index > 0 &&
        !isRowComplete(rows[index - 1])
      )
        ? "not-allowed"
        : "pointer",
    pointerEvents:
      index >= parseInt(paymentData.installments || 0) ||
      (
        index > 0 &&
        !isRowComplete(rows[index - 1])
      )
        ? "none"
        : "auto",
  }}
>
                              <FiUpload className="edit" />
                             <input
  type="file"
  style={{ display: 'none' }}
  disabled={
    index >= parseInt(paymentData.installments || 0) ||
    (
      index > 0 &&
      !isRowComplete(rows[index - 1])
    )
  }
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
                            disabled={
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
}
style={{
  cursor:
  index >= parseInt(paymentData.installments || 0) ||
  (
    index > 0 &&
    !isRowComplete(rows[index - 1])
  )
    ? "not-allowed"
    : "pointer",
  backgroundColor:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? "#f5f5f5"
      : "",
  opacity:
    index > 0 &&
    !isRowComplete(rows[index - 1])
      ? 0.7
      : 1
}}
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
                  <input type="text" class="schedule-input" id="inputEmail4" name='total' value={paymentData.total} onChange={handleChange} />
                </div>
                <div class="col">
                  <label for="inputEmail4" class="form-label">Balance Pay</label>
                  <input type="text" class="schedule-input" id="inputEmail4" name='balance' value={paymentData.balance} onChange={handleChange} />
                </div>
              </div>
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <div className='course-row'>
                {formMode === "Add" ? (
                  <>
                    {/* <button className='submit-btn' onClick={handleSave} disabled={isSaveDisabled}>Save</button> */}
                 <button 
  className='submit-btn' 
  onClick={handleSave} 
  disabled={isSaveDisabled || isLoading || isSaved || isInvoiceSent}
  style={{
  backgroundColor:
    (isSaveDisabled || isLoading || isSaved || isInvoiceSent)
      ? "#ccc"
      : "#007bff",

  cursor:
    (isSaveDisabled || isLoading || isSaved || isInvoiceSent)
      ? "not-allowed"
      : "pointer",

  opacity: 1
}}
>
  {isLoading
    ? "Saving..."
    : isSaved || isInvoiceSent
    ? "Saved"
    : "Save"}
</button>
                    <button
                      className='submit-btn'
                      onClick={handleSendToEmail}
                      disabled={!isSaved}
                      style={{ cursor: isSaved ? 'pointer' : 'not-allowed' }}
                    >
                      Send to Email
                    </button>
                  </>
                ) : (
                  <>
                   <button
  className='submit-btn'
  onClick={handleUpdate}
  disabled={isSaveDisabled || isLoading || isInvoiceSent}
  style={{
    backgroundColor:
      (isSaveDisabled || isLoading || isInvoiceSent)
        ? "#ccc"
        : "#007bff",
    cursor:
      (isSaveDisabled || isLoading || isInvoiceSent)
        ? "not-allowed"
        : "pointer",
    opacity: 1
  }}
>
  {isLoading
    ? "Updating..."
    : isInvoiceSent
    ? "Updated"
    : "Update"}
</button>
                    <button
                      className='submit-btn'
                      onClick={handleSendToEmail}
                      disabled={!isSaved}
                      style={{ cursor: isSaved ? 'pointer' : 'not-allowed' }}
                    >
                      Send to Email
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>View Offline Payment List</p>
                </div>
                
                {/* Success and Error Messages
                {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
                {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>} */}
                
                <div className='date-schedule'>
                  Start Date
                  <DatePicker
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }} />
                  End Date
                  <DatePicker
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                  />
                  <button className='filter' onClick={handleDateFilter}>Filter</button>
                  <button className="filter" onClick={handleDateReset}>Reset</button>
                </div>


{/* Payment Summary Table */}
{/* Payment Summary Table */}
{startDate && endDate && summaryData.length > 0 && (
  <div
    style={{
      width: "100%",
      marginBottom: "15px",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <table
      style={{
        borderCollapse: "collapse",
        textAlign: "center",
        width: "85%",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        fontSize: "14px"
      }}
    >
      <thead>
        <tr style={{ background: "#00AEEF", color: "#fff" }}>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>🌍 Currency</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>💰 Total Revenue</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>🟡 Pending</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>🔴 Overdue</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>🟢 Paid</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>📈 Total Payments</th>
        </tr>
      </thead>

      
        {/* {summaryData.map((item, index) => { */}
<tbody>

{(() => {

const totalRevenueUSD = summaryData.reduce((sum, item) => {

  if (item.currency === "USD") {
    return sum + item.totalRevenue;
  }

   if (item.currency === "CAD") {

    const converted = Number(item.totalRevenue) / Number(cadRate);

    console.log("CAD Converted:", converted);

    return sum + converted;
  }

  if (item.currency === "INR") {
    return sum + (item.totalRevenue / inrRate);
  }

  return sum;

}, 0);

const totalPendingUSD = summaryData.reduce((sum, item) => {

  if (item.currency === "USD") {
    return sum + item.pendingAmount;
  }

  if (item.currency === "CAD") {
    return sum + (item.pendingAmount / cadRate);
  }

  if (item.currency === "INR") {
    return sum + (item.pendingAmount / inrRate);
  }

  return sum;

}, 0);

const totalPaymentsUSD = summaryData.reduce((sum, item) => {

  if (item.currency === "USD") {
    return sum + item.totalPayments;
  }

  if (item.currency === "CAD") {
    return sum + (item.totalPayments / cadRate);
  }

  if (item.currency === "INR") {
    return sum + (item.totalPayments / inrRate);
  }

  return sum;

}, 0);

const totalPaidCount = summaryData.reduce(
  (sum, item) => sum + item.paidCount,
  0
);

const totalOverdueCount = summaryData.reduce(
  (sum, item) => sum + item.overdueCount,
  0
);

return (
<>

{summaryData
  .filter(item => item.currency && item.currency.trim() !== "")
  .map((item, index) => {
          const symbol =
            item.currency === "USD"
              ? "$"
              : item.currency === "INR"
              ? "₹"
              : item.currency === "CAD"
              ? "C$"
              : "";

          return (
            <tr key={index}>
              <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>
                {item.currency === "USD" && "🇺🇸 USD"}
                {item.currency === "INR" && "🇮🇳 INR"}
                {item.currency === "CAD" && "🇨🇦 CAD"}
                {/* {!item.currency && "N/A"} */}
              </td>

              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.totalRevenue}
              </td>

              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.pendingAmount}
              </td>

              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.overdueCount}
              </td>

              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.paidCount}
              </td>

              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {item.totalPayments}
              </td>
            </tr>
          );
                })}

<tr
  style={{
    background: "#f5f5f5",
    fontWeight: "bold"
  }}
>
  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
    💵 TOTAL (USD)
  </td>

  <td style={{ padding: "10px", border: "1px solid #ddd", color: "green" }}>
    ${totalRevenueUSD.toFixed(2)}
  </td>

  <td style={{ padding: "10px", border: "1px solid #ddd", color: "orange" }}>
    ${totalPendingUSD.toFixed(2)}
  </td>

  {/* <td style={{ padding: "10px", border: "1px solid #ddd" }}>
    {totalOverdueCount}
  </td> */}
<td style={{ padding: "10px", border: "1px solid #ddd" }}>
  {summaryData
    .filter(item => item.currency && item.currency.trim() !== "")
    .reduce((sum, item) => sum + item.overdueCount, 0)}
</td>
  {/* <td style={{ padding: "10px", border: "1px solid #ddd" }}>
    {totalPaidCount}
  </td> */}
<td style={{ padding: "10px", border: "1px solid #ddd" }}>
  {summaryData
    .filter(item => item.currency && item.currency.trim() !== "")
    .reduce((sum, item) => sum + item.paidCount, 0)}
</td>
  <td style={{ padding: "10px", border: "1px solid #ddd", color: "blue" }}>
    ${totalPaymentsUSD.toFixed(2)}
  </td>
</tr>

</>
);

})()}

</tbody>
    </table>
  </div>
)}


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
                      <input className="search-input" type="search" placeholder="Enter Courses, Name, Status or Keywords" aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                      <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
                    </div>
                    
                    {/* Bulk Delete Button */}
                    {selectedIds.length > 0 && (
                      <button 
                        type="button" 
                        className="btn-category" 
                        onClick={handleBulkDelete}
                        style={{ backgroundColor: '#dc3545', marginRight: '10px' }}
                      >
                        <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                      </button>
                    )}
                    
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
                  {/* Select All Checkbox */}
                  <StyledTableCell align='center'>
                    <Checkbox 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCourse.length}
                    />
                  </StyledTableCell>
                  <StyledTableCell align='center'>S.No.</StyledTableCell>
                  <StyledTableCell align='center'>Student ID</StyledTableCell>
                  <StyledTableCell align='center'>Student Name</StyledTableCell>
                  <StyledTableCell align='center'>Email</StyledTableCell>
                  <StyledTableCell align="center">Mobile</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Course Fee</StyledTableCell>
                  <StyledTableCell align="center">No. of installments</StyledTableCell>
                  <StyledTableCell align="center">Balance Fee</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Created Date </StyledTableCell>
                  {/* Reminder Status Column with Toggle-like Display */}
                  <StyledTableCell align="center">Reminder</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCourse.length > 0 ? (
                  displayedCourse.map((curr, index) => {
                    return (
                      <StyledTableRow key={curr.id}>
                        {/* Individual Checkbox */}
                        <StyledTableCell align='center'>
                          <Checkbox 
                            checked={selectedIds.includes(curr.id)}
                            onChange={() => handleSelectOne(curr.id)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {index + 1 + (currentPage - 1) * rowsPerPage}
                        </StyledTableCell>
                        <StyledTableCell align="center">{curr.student_ID}</StyledTableCell>
                        <StyledTableCell align="center">{curr.student_name}</StyledTableCell>
                        <StyledTableCell align="center">{curr.email}</StyledTableCell>
                        <StyledTableCell align="center">{curr.mobile}</StyledTableCell>
                        <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
                        <StyledTableCell align="center"> {curr.course_fee} {curr.currency ? ` (${curr.currency})` : ""}</StyledTableCell>
                        <StyledTableCell align="center">{curr.installments}</StyledTableCell>
                        <StyledTableCell align="center">{curr.balance}</StyledTableCell>
                        <StyledTableCell align="center">{curr.status}</StyledTableCell>
                        <StyledTableCell align="center">
                          {curr.date ? dayjs(curr.date).format('MMM-DD-YYYY').toUpperCase() : ''}
                        </StyledTableCell>
                        {/* Display Reminder Status as Toggle-like Badge */}
                        <StyledTableCell align="center">
                          <span style={{ 
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            backgroundColor: curr.reminderEnabled ? '#e6f7e6' : '#ffe6e6',
                            color: curr.reminderEnabled ? '#28a745' : '#dc3545',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            border: `1px solid ${curr.stopReminder ? '#28a745' : '#dc3545'}`
                          }}>
                            {curr.reminderEnabled ? 'START' : 'STOP'}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
                            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.id)} />
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    {/* Updated colSpan from 14 to 15 to include reminder status column */}
                    <StyledTableCell colSpan={15} align="center">
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
        </div>
      )}
    </>
  );
}