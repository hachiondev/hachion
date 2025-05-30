import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminPagination from "./AdminPagination";
import "./Admin.css";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white", // Add vertical lines
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: "1px solid #e0e0e0", // Add vertical lines for body rows
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
export default function RegisterStudent() {
  const [enrollData, setEnrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    axios
      .get("https://api.hachion.co/api/v1/user/students")
      .then((response) => {
        setEnrollData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);
  const filteredData = enrollData.filter((item) => {
    const date = new Date(item.date || item.enroll_date);
    const matchesSearch =
      searchTerm === "" ||
      [item.userName, item.email, item.country]
        .map((field) => (field || "").toLowerCase())
        .some((field) => field.includes(searchTerm.toLowerCase()));
    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="course-category">
          <div className="category-header">
            <p>Online Registered Student</p>
          </div>
          <div className="date-schedule">
            Start Date
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              sx={{
                "& .MuiIconButton-root": { color: "#00aeef" },
              }}
            />
            End Date
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              sx={{
                "& .MuiIconButton-root": { color: "#00aeef" },
              }}
            />
            <button className="filter">Filter</button>
          </div>
          <div className="entries">
            <div className="entries-left">
              <p style={{ marginBottom: "0" }}>Show</p>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn-number dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {rowsPerPage}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={() => setRowsPerPage(10)}
                    >
                      10
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={() => setRowsPerPage(25)}
                    >
                      25
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#!"
                      onClick={() => setRowsPerPage(50)}
                    >
                      50
                    </a>
                  </li>
                </ul>
              </div>
              <p style={{ marginBottom: "0" }}>entries</p>
            </div>
            <div className="entries-right">
              <div
                className="search-div"
                role="search"
                style={{ border: "1px solid #d3d3d3" }}
              >
                <input
                  className="search-input"
                  type="search"
                  placeholder="Enter Name, email or country"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-search" type="submit">
                  <IoSearch style={{ fontSize: "2rem" }} />
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
              <StyledTableCell>
                <Checkbox />
              </StyledTableCell>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell align="center">Student ID</StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Country</StyledTableCell>
              {/* <StyledTableCell align="center">Action</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                  <StyledTableCell>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row.studentId}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.userName}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.country}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">
                                    <RiDeleteBin6Line className="delete" onClick={() => handleDelete(row.id)} style={{ cursor: "pointer", color: "red" }} />

                                </StyledTableCell> */}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={15} align="center">
                  No data available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination-container">
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
