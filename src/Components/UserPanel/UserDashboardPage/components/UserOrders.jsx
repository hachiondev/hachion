import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiDownload } from "react-icons/fi";
import dayjs from 'dayjs';
import '../../Dashboard.css';

export default function UserOrders() {
  const [rows, setRows] = useState([]);
  const [studentName, setStudentName] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    const email = user?.email;
    if (!email) return;

    axios.get(`https://api.test.hachion.co/razorpay/orders?email=${email}`)
      .then((res) => {
        const data = res.data.map((item, index) => {
          let formattedDate = '-';
          if (item.paymentDate) {
            formattedDate = dayjs(item.paymentDate).format('MMMM D, YYYY');
          }

          return {
            orderID: item.invoiceNumber || `#${index + 1}`,
            courseName: item.courseName || '-',
            paymentDate: formattedDate,
            price: item.totalAmount
              ? item.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
              : '₹0',
            status: item.status || 'Processing',
          };
        });
        setRows(data);
      })
      .catch((err) => console.error('Error fetching dashboard orders:', err));
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loginuserData")) || null;
    const email = user?.email;
    if (!email) {
      setProfileLoading(false);
      return;
    }

    axios
      .get("https://api.test.hachion.co/api/v1/user/myprofile", { params: { email } })
      .then((res) => {
        
        setStudentName(res.data?.studentName || res.data?.name || null);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      })
      .finally(() => {
        setProfileLoading(false);
      });
  }, []);

  
  const buildInvoiceUrl = (studentName, courseName) => {
    if (!studentName || !courseName) return null;

    const safeStudent = studentName.trim().replace(/\s+/g, "_");
    const safeCourse = courseName.trim().replace(/\s+/g, "_");

    const fileName = `${safeStudent}_${safeCourse}.pdf`;
    const encodedFileName = encodeURIComponent(fileName);

    return `https://api.test.hachion.co/uploads/test/payments/invoices/${encodedFileName}`;
  };

  const handleDownloadInvoice = (courseName) => {
    if (profileLoading) return;

    if (!studentName) {
      alert("Profile not loaded. Please refresh the page.");
      return;
    }

    const url = buildInvoiceUrl(studentName, courseName);

    if (!url) {
      alert("Invoice not available yet");
      return;
    }

    
    window.open(url, "_blank");
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'user-status-badge paid'; 
      case 'partially paid':
        return 'user-status-badge partially-paid'; 
      default:
        return 'user-status-badge processing'; 
    }
  };

  return (
    <div className='resume-div'>
      <div className='resume-div-table'>
        <div className='button-div'>
          <TableContainer component={Paper} className="table-scroll">
            <Table className='resume-table' stickyHeader aria-label="user orders table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Order ID</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.orderID}>
                    <TableCell align="center">{row.orderID}</TableCell>
                    <TableCell align="left">{row.courseName}</TableCell>
                    <TableCell align="left">{row.paymentDate}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                    <TableCell align="center">
                      <span className={getStatusClass(row.status)}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <FiDownload
                        className="invoice-icon"
                        style={{
                          cursor: profileLoading ? "not-allowed" : "pointer",
                          opacity: profileLoading ? 0.4 : 1
                        }}
                        title={profileLoading ? "Loading profile..." : "View Invoice"}
                        onClick={() => handleDownloadInvoice(row.courseName)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}