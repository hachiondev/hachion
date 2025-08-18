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
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#00AEEF',
        color: theme.palette.common.white,
        borderRight: '1px solid white', // Add vertical lines
        padding: '3px 5px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '3px 4px',
        borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
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
       const handleDateFilter = () => {
          const filtered = onlinePayment.filter((item) => {
            const itemDate = dayjs(item.date);
            return (
              (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
              (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
            );
          });
          setFilteredRows(filtered);
        };
      
        const handleDateReset = () => {
          setStartDate(null);
          setEndDate(null);
          setFilteredRows(onlinePayment);
        };
        useEffect(() => {
        setFilteredRows(onlinePayment);
      }, [onlinePayment]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                      <div className='category-header'><p style={{ marginBottom: 0 }}>View Online Payment List</p></div>
                      <div className='date-schedule'>
                                  Start Date
                                  <DatePicker 
                          selected={startDate} 
                          onChange={(date) => setStartDate(date)} 
                          isClearable 
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
                        }}/>
                                  End Date
                                  <DatePicker 
                          selected={endDate} 
                          onChange={(date) => setEndDate(date)} 
                          isClearable 
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
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
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(10)}>10</a></li>
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(25)}>25</a></li>
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(50)}>50</a></li>
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
                        </div>
                      </div>
                    </div>
                  </LocalizationProvider>
            
                  <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'><Checkbox /></StyledTableCell>
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
                            <StyledTableCell align="center">Created Date </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                            <StyledTableCell><Checkbox /></StyledTableCell>
                            <StyledTableCell>{index + 1}</StyledTableCell>
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
                            <StyledTableCell align="center">{row.date}</StyledTableCell>
                            </StyledTableRow>
                                          ))
                                        ) : (
                                          <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center">No data available</StyledTableCell>
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
                                      onPageChange={setCurrentPage}
                                    />
                                  </div>
                                </>
                              );
                            }
                            