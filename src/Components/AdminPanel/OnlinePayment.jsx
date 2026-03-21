import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import NoData from '../../Assets/nodata.webp'
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";


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
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default function OnlinePayment() {
  const [onlinePayment, setOnlinePayment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  
  // ADDED: State for checkbox selection and bulk delete
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredData = onlinePayment.filter((item) => {
    const date = new Date(item.date || item.payment_date);
    const matchesSearch =
      searchTerm === '' ||
      [item.student_ID, item.userName, item.email, item.mobile, item.course_name, item.method, item.status, item.method, item.date ? dayjs(item.date).format('MMM-DD-YYYY') : '']
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()));
    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleDateFilter = () => {
    const filtered = onlinePayment.filter((item) => {
      const itemDate = dayjs(item.date);
      return (
        (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
        (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
      );
    });
    setFilteredRows(filtered);
    setCurrentPage(1);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredRows(onlinePayment);
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredRows(onlinePayment);
  }, [onlinePayment]);

  useEffect(() => {
    const fetchOnlinePayments = async () => {
      try {
        const res = await axios.get("https://api.test.hachion.co/razorpay/payments");
        if (res.data) {
          // Map backend response to match your existing table field names
          const mappedData = res.data.map((item, index) => ({
             id: item.id,
            student_ID: item.studentId,
            userName: item.studentName,
            email: item.email,
            mobile: item.mobile,
            course_name: item.courseName,
            fee: item.courseFee,
            coupon: item.coupon,
            installments: item.numOfInstallments,
            paidInstallments: item.paidInstallments,
            balance: item.balanceFee,
            status: item.status,
            method: item.paymentMethod,
            date: dayjs(item.createdDate).format("YYYY-MM-DD")
          })) .filter(item => item.id !== undefined && item.id !== null);;

          setOnlinePayment(mappedData);
          setFilteredRows(mappedData);
        }
      } catch (err) {
        console.error("Error fetching online payments:", err);
        setOnlinePayment([]);
        setFilteredRows([]);
      }
    };

    fetchOnlinePayments();
  }, []);

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedData.map(payment => payment.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // ADDED: Handle individual checkbox
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedData.length) {
        setSelectAll(true);
      }
    }
  };

  // ADDED: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedData.map(payment => payment.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedData, selectedIds]);

  // ADDED: Handle bulk delete
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
        // Note: This assumes there's a delete endpoint. If not, you may need to adjust this.
        // Delete all selected payments
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/razorpay/payments/${id}`)
          )
        );

        // Update state
        const updatedPayments = onlinePayment.filter(item => !selectedIds.includes(item.id));
        setOnlinePayment(updatedPayments);
        setFilteredRows(updatedPayments);
        
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

  // ADDED: Handle individual delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this payment?");
    if (!confirmed) return;

    try {
      // Note: This assumes there's a delete endpoint. If not, you may need to adjust this.
      await axios.delete(`https://api.test.hachion.co/razorpay/payments/${id}`);
      
      const updatedPayments = onlinePayment.filter(item => item.id !== id);
      setOnlinePayment(updatedPayments);
      setFilteredRows(updatedPayments);
      
      // Remove from selectedIds if present
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      
      setSuccessMessage("✅ Payment deleted successfully.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting payment:", error);
      setErrorMessage("❌ Failed to delete payment.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>View Online Payment List</p></div>
          
          {/* ADDED: Success and Error Messages */}
          {successMessage && <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
          
          <div className='date-schedule'>
            Start Date
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              sx={{
                '& .MuiIconButton-root': { color: '#00aeef' }
              }} />
            End Date
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              sx={{
                '& .MuiIconButton-root': { color: '#00aeef' }
              }}
            />
            <button className='filter' onClick={handleDateFilter}>Filter</button>
            <button className="filter" onClick={handleDateReset}>Reset</button>
          </div>
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
                <input
                  className="search-input"
                  type="search"
                  placeholder="Enter Name, Course Name, Status or Keywords"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-search" type="submit">
                  <IoSearch style={{ fontSize: '2rem' }} />
                </button>
              </div>
              
              {/* ADDED: Bulk Delete Button */}
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
            </div>
          </div>
        </div>
      </LocalizationProvider>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {/* ADDED: Select All Checkbox */}
              <StyledTableCell align='center'>
                <Checkbox 
                  checked={selectAll}
                  onChange={handleSelectAll}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < displayedData.length}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>S.No.</StyledTableCell>
              <StyledTableCell align='center'>Student ID</StyledTableCell>
              <StyledTableCell align='center'>Student Name</StyledTableCell>
              <StyledTableCell align='center'>Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Course Name</StyledTableCell>
              <StyledTableCell align="center">Course Fee</StyledTableCell>
              <StyledTableCell align="center">Coupon</StyledTableCell>
              <StyledTableCell align="center">No. of Installments</StyledTableCell>
              <StyledTableCell align="center">Paid Installments</StyledTableCell>
              <StyledTableCell align="center">Balance Fee</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Payment Method</StyledTableCell>
              <StyledTableCell align="center">Created Date</StyledTableCell>
              {/* ADDED: Action Column */}
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.id}>
                  {/* ADDED: Individual Checkbox */}
                  <StyledTableCell align="center">
                    <Checkbox 
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{(currentPage - 1) * rowsPerPage + index + 1}</StyledTableCell>
                  <StyledTableCell align="left">{row.student_ID}</StyledTableCell>
                  <StyledTableCell align="left">{row.userName}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                  <StyledTableCell align="left">{row.fee}</StyledTableCell>
                  <StyledTableCell align="left">{row.coupon}</StyledTableCell>
                  <StyledTableCell align="center">{row.installments}</StyledTableCell>
                  <StyledTableCell align="center">{row.paidInstallments}</StyledTableCell>
                  <StyledTableCell align="center">{row.balance}</StyledTableCell>
                  <StyledTableCell align="center">{row.status}</StyledTableCell>
                  <StyledTableCell align="left">{row.method}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.date
                      ? dayjs(row.paymentDate).format("MMM-DD-YYYY").toUpperCase()
                      : "N/A"}
                  </StyledTableCell>
                  {/* ADDED: Action Column */}
                  <StyledTableCell align="center">
                    <RiDeleteBin6Line
                      className="delete"
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => handleDelete(row.id)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                {/* UPDATED: Changed colSpan from 15 to 17 to include checkbox and action columns */}
                <StyledTableCell colSpan={17} align="center" className="program-schedule">
                  <img src={NoData} alt="No Data" />
                  <p>No data available</p>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination-container'>
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredData.length}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}