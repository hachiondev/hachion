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
import './Dashboard.css';

export default function UserOrders() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    const email = user?.email;
    if (!email) return;

    axios.get(`https://api.hachion.co/razorpay/orders?email=${email}`)
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
            invoice: <FiDownload className='invoice-icon' />
          };
        });
        setRows(data);
      })
      .catch((err) => console.error('Error fetching dashboard orders:', err));
  }, []);

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
                    <TableCell align="center">{row.invoice}</TableCell>
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
