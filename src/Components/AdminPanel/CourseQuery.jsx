import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import "./Admin.css";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminPagination from "./AdminPagination";
import { RiDeleteBin6Line } from 'react-icons/ri';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: "1px solid #e0e0e0",
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

export default function CourseQuery() {
  const [courseQuery, setCourseQuery] = useState([]);
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDelete = async (id) => {
    
  
    try {
      await axios.delete(`https://api.hachion.co/haveanyquery/delete/${id}`);
      const updatedList = courseQuery.filter((item) => item.id !== id);
      setCourseQuery(updatedList);
      setFilteredCourse(updatedList);
    } catch (error) {
      console.error("Error deleting entry:", error.message);
    }
  };
  
  useEffect(() => {
    const fetchCourseQuery = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/haveanyquery");
        setCourseQuery(response.data);
        setFilteredCourse(response.data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchCourseQuery();
  }, []);

  // Handle pagination
  const displayedCategories = filteredCourse.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Checkbox />
              </StyledTableCell>
              <StyledTableCell align="center">S.No.</StyledTableCell>
              <StyledTableCell align="center">Full Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Comment</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Country</StyledTableCell>
              <StyledTableCell align="center">Country</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCategories.length > 0 ? (
              displayedCategories.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="center">{row.comment}</StyledTableCell>
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">{row.country}</StyledTableCell>
                    <StyledTableCell align="center" style={{ width: 220, }}>
                            
                          
                              <RiDeleteBin6Line className="delete"  onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer' }} />
                            
                            </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  No Data Available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="pagination-container">
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredCourse.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
