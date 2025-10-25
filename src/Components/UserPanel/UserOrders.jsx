import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiDownload } from "react-icons/fi";
import './Dashboard.css';

function createData(orderID, courseName, date, price, invoice, status) {
  return { orderID, courseName, date, price, invoice, status };
}

const rows = [
  createData('#1', 'QA Automation', '06-08-2025', '30,000', <FiDownload className='invoice-icon' />, 'Success'),
  createData('#2', 'Python', '08-09-2025', '15,000', <FiDownload className='invoice-icon' />, 'Canceled'),
  createData('#3', 'Web Development', '09-10-2025', '20,000', <FiDownload className='invoice-icon' />, 'Processing'),
  createData('#4', 'App Development', '10-11-2025', '25,000', <FiDownload className='invoice-icon' />, 'Onhold'),
  createData('#5', 'Full Stack Bootcamp', '15-12-2025', '35,000', <FiDownload className='invoice-icon' />, 'Success'),
  createData('#6', 'React Advanced', '20-01-2026', '28,000', <FiDownload className='invoice-icon' />, 'Processing'),
];

export default function UserOrders() {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'user-status-badge success';
      case 'processing':
        return 'user-status-badge processing';
      case 'onhold':
        return 'user-status-badge onhold';
      case 'canceled':
        return 'user-status-badge canceled';
      default:
        return 'user-status-badge';
    }
  };

  return (
    <div className='resume-div'>
      <div className='resume-div-table'>
        <div className='button-div'>
          {/* Use your CSS scroll class here */}
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
                    <TableCell align="left">{row.date}</TableCell>
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
