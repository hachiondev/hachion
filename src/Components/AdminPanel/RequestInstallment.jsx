import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import { FaCheckCircle } from 'react-icons/fa';
import { RiCloseCircleLine } from 'react-icons/ri';
import { RiDeleteBin6Line } from 'react-icons/ri';
import NoData from '../../Assets/nodata.webp'
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from 'axios';


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
export default function RequestInstallment() {
  const [requestInstallment, setRequestInstallment] = useState([]);
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

  const filteredData = requestInstallment.filter((item) => {
    const date = new Date(item.date || item.payment_date);
    const matchesSearch =
      searchTerm === '' ||
      [item.student_ID, item.userName, item.email, item.mobile, item.course_name, item.requestInstallments, item.requestStatus, item.date ? dayjs(item.date).format('MMM-DD-YYYY') : '']
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
    const filtered = requestInstallment.filter((item) => {
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
    setFilteredRows(requestInstallment);
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredRows(requestInstallment);
  }, [requestInstallment]);

  useEffect(() => {
    const fetchRequestInstallments = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/razorpay/request-installments');

        const mappedData = response.data.map((item) => ({
          id: item.id,
          student_ID: item.studentId,
          userName: item.studentName,
          email: item.payerEmail,
          mobile: item.mobile,
          course_name: item.courseName,
          batchId: item.batchId,
          fee: item.courseFee,
          requestInstallments: item.numSelectedInstallments,
          date: item.requestDate,
          coupon: '',
          requestStatus: item.requestStatus
        }));

        setRequestInstallment(mappedData);
        setFilteredRows(mappedData);
      } catch (error) {
        console.error('Error fetching installment requests:', error);
      }
    };

    fetchRequestInstallments();
  }, []);


  // const handleDelete = async (id) => {
  //     const confirmed = window.confirm("Are you sure you want to delete this payment?");
  //     if (!confirmed) return;
  
  //     try {
  //       // Note: This assumes there's a delete endpoint. If not, you may need to adjust this.
  //       await axios.delete(`https://api.test.hachion.co/razorpay/payments/${id}`);
        
  //       const updatedPayments = onlinePayment.filter(item => item.id !== id);
  //       setOnlinePayment(updatedPayments);
  //       setFilteredRows(updatedPayments);
        
  //       // Remove from selectedIds if present
  //       setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        
  //       setSuccessMessage("✅ Payment deleted successfully.");
  //       setErrorMessage("");
  //       setTimeout(() => setSuccessMessage(""), 3000);
  //     } catch (error) {
  //       console.error("Error deleting payment:", error);
  //       setErrorMessage("❌ Failed to delete payment.");
  //       setSuccessMessage("");
  //       setTimeout(() => setErrorMessage(""), 3000);
  //     }
  //   };
  
 const handleDelete = async (row) => {
  const confirmed = window.confirm("Are you sure you want to delete this installment request?");
  if (!confirmed) return;

  try {

    const response = await axios.delete(`https://api.test.hachion.co/razorpay/delete-installment-request`, {
      params: {
        studentId: row.student_ID,
        email: row.email,
        courseName: row.course_name,
        batchId: row.batchId
      }
    });

    const message = response.data;

    if (message && message.toLowerCase().includes("success")) {

      const updatedData = requestInstallment.filter(item => item.id !== row.id);

      setRequestInstallment(updatedData);
      setFilteredRows(updatedData);

      setSelectedIds(prev => prev.filter(selectedId => selectedId !== row.id));

      setSuccessMessage("✅ " + message);
      setErrorMessage("");

    } else {

      setErrorMessage("❌ " + message);
      setSuccessMessage("");

    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);

  } catch (error) {
    console.error("Error deleting installment request:", error);

    setErrorMessage("❌ Failed to delete installment request.");
    setSuccessMessage("");

    setTimeout(() => setErrorMessage(""), 4000);
  }
};
  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedData.map(installment => installment.id);
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
    const allCurrentPageIds = displayedData.map(installment => installment.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedData, selectedIds]);

  // ADDED: Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one request to approve");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to approve ${selectedIds.length} selected ${selectedIds.length === 1 ? 'request' : 'requests'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Approve all selected requests
        await Promise.all(
          selectedIds.map(id =>
            axios.put(`https://api.test.hachion.co/razorpay/update-status/${id}`, null, {
              params: { requestStatus: "approved" },
            })
          )
        );

        // Update state
        const updatedData = requestInstallment.map((item) =>
          selectedIds.includes(item.id) ? { ...item, requestStatus: "approved" } : item
        );
        setRequestInstallment(updatedData);
        setFilteredRows(updatedData);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'request' : 'requests'} approved successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error approving requests:", error);
        setSuccessMessage("");
        setErrorMessage("Error approving some requests. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  // ADDED: Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one request to reject");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to reject ${selectedIds.length} selected ${selectedIds.length === 1 ? 'request' : 'requests'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Reject all selected requests
        await Promise.all(
          selectedIds.map(id =>
            axios.put(`https://api.test.hachion.co/razorpay/update-status/${id}`, null, {
              params: { requestStatus: "rejected" },
            })
          )
        );

        // Update state
        const updatedData = requestInstallment.map((item) =>
          selectedIds.includes(item.id) ? { ...item, requestStatus: "rejected" } : item
        );
        setRequestInstallment(updatedData);
        setFilteredRows(updatedData);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'request' : 'requests'} rejected successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error rejecting requests:", error);
        setSuccessMessage("");
        setErrorMessage("Error rejecting some requests. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>View Installment requests</p></div>
          
          {/* ADDED: Success and Error Messages */}
       
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
                  placeholder="Enter Name, Course Name, Imstallments or Keywords"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-search" type="submit">
                  <IoSearch style={{ fontSize: '2rem' }} />
                </button>
              </div>
              
              {/* ADDED: Bulk Action Buttons */}
              {selectedIds.length > 0 && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    className="btn-category" 
                    onClick={handleBulkApprove}
                    style={{ backgroundColor: '#28a745', marginRight: '10px' }}
                  >
                    <FaCheckCircle /> Approve Selected ({selectedIds.length})
                  </button>
                  <button 
                    type="button" 
                    className="btn-category" 
                    onClick={handleBulkReject}
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    <RiCloseCircleLine /> Reject Selected ({selectedIds.length})
                  </button>
                </div>
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
              <StyledTableCell align='center'>Batch ID</StyledTableCell>
              <StyledTableCell align='center'>Student Name</StyledTableCell>
              <StyledTableCell align='center'>Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Course Name</StyledTableCell>
              <StyledTableCell align="center">Course Fee</StyledTableCell>
              <StyledTableCell align="center">Requested Installments</StyledTableCell>
              <StyledTableCell align="center">Created Date </StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.id || index}>
                  {/* ADDED: Individual Checkbox */}
                  <StyledTableCell align="center">
                    <Checkbox 
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.student_ID}</StyledTableCell>
                  <StyledTableCell align="left">{row.batchId}</StyledTableCell>
                  <StyledTableCell align="left">{row.userName}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                  <StyledTableCell align="left">{row.fee}</StyledTableCell>
                  <StyledTableCell align="center">{row.requestInstallments}</StyledTableCell>
                  <StyledTableCell align="center">{dayjs(row.date).format('MMM-DD-YYYY').toUpperCase()}</StyledTableCell>

                  <StyledTableCell align="center">
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      {row.requestStatus === 'approved' ? (
                        <span className="approved">Approved</span>
                      ) : row.requestStatus === 'rejected' ? (
                        <span className="rejected">Rejected</span>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <FaCheckCircle
                            className="approve"
                            style={{ cursor: 'pointer', color: 'green' }}
                            onClick={async () => {
                              try {
                                await axios.put(`https://api.test.hachion.co/razorpay/update-status/${row.id}`, null, {
                                  params: { requestStatus: "approved" },
                                });

                                const updatedData = requestInstallment.map((item) =>
                                  item.id === row.id ? { ...item, requestStatus: "approved" } : item
                                );
                                setRequestInstallment(updatedData);
                                setFilteredRows(updatedData);
                                
                                // Remove from selectedIds if present
                                setSelectedIds(prev => prev.filter(id => id !== row.id));
                              } catch (error) {
                                console.error("Error updating requestStatus:", error);
                              }
                            }}
                          />
                          <RiCloseCircleLine
                            className="reject"
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={async () => {
                              try {
                                await axios.put(`https://api.test.hachion.co/razorpay/update-status/${row.id}`, null, {
                                  params: { requestStatus: "rejected" },
                                });

                                const updatedData = requestInstallment.map((item) =>
                                  item.id === row.id ? { ...item, requestStatus: "rejected" } : item
                                );
                                setRequestInstallment(updatedData);
                                setFilteredRows(updatedData);
                                
                                // Remove from selectedIds if present
                                setSelectedIds(prev => prev.filter(id => id !== row.id));
                              } catch (error) {
                                console.error("Error updating requestStatus:", error);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </StyledTableCell>
                   <StyledTableCell align="center">
                                      <RiDeleteBin6Line
                                        className="delete"
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        // onClick={() => handleDelete(row.id)}
                                        onClick={() => handleDelete(row)}
                                      />
                                    </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                {/* UPDATED: Changed colSpan from 11 to 12 to include checkbox column */}
                <StyledTableCell colSpan={12} align="center" className="program-schedule"><img src={NoData} alt="No Data" />
                  <p>No data available</p>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
   {successMessage && <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
          
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