// import React, { useEffect, useState } from 'react';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { RiDeleteBinLine } from "react-icons/ri";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './Blogs.css';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#d3d3d3',
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     color: theme.palette.common.black,
//     border: `1px solid ${theme.palette.common.black}`,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // Mapping Country Code to Currency Code
// const countryToCurrencyMap = {
//   'IN': 'INR',
//   'US': 'USD',
//   'GB': 'GBP',
//   'AU': 'AUD',
//   'CA': 'CAD',
//   'EU': 'EUR'
// };

// export default function EnrollmentTable() {
//   const { courseName } = useParams();
//   const [courseData, setCourseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState('USD');
//   const [exchangeRate, setExchangeRate] = useState(1);

//   // Fetch User Location and Exchange Rate
//   useEffect(() => {
//     const fetchGeolocationData = async () => {
//       try {
//         const geoResponse = await axios.get('https://ipinfo.io?token=82aafc3ab8d25b');
//         console.log('Geolocation Response:', geoResponse.data); // Verify data structure

//         const countryCode = geoResponse.data.country || 'US';
//         const detectedCurrency = countryToCurrencyMap[countryCode] || 'USD';
//         setCurrency(detectedCurrency);

//         const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
//         const rate = exchangeResponse.data.rates[detectedCurrency] ?? 1;
//         setExchangeRate(rate);
//       } catch (error) {
//         console.error('Error fetching geolocation or exchange data:', error);
//       }
//     };

//     fetchGeolocationData();
//   }, []);

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('https://api.hachion.co/courses/all');

//         const matchedCourse = response.data.find(
//           (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName.toLowerCase().replace(/\s+/g, '-')
//         );

//         if (matchedCourse) {
//           setCourseData(matchedCourse);
//         } else {
//           console.error("Course not found.");
//         }
//       } catch (error) {
//         console.error('Error fetching course data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, [courseName]);

//   if (loading) return <div>Loading...</div>;
//   if (!courseData) return <div>No matching course found.</div>;

//   // Currency Conversion
//   const convertAmount = (amount) => (amount * exchangeRate).toFixed(2);

//   return (
//     <TableContainer component={Paper}>
//       <Table className='table-details' sx={{ minWidth: 700 }} aria-label="customized table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell align="center">Course Name</StyledTableCell>
//             <StyledTableCell align="center">Batch</StyledTableCell>
//             <StyledTableCell align="center">Fee</StyledTableCell>
//             <StyledTableCell align="center">% Discount</StyledTableCell>
//             <StyledTableCell align="center">Total</StyledTableCell>
//             <StyledTableCell align="center">Action</StyledTableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           <StyledTableRow key={courseData.courseName}>
//             <StyledTableCell component="th" scope="row" align="center">
//               {courseData.courseName}
//             </StyledTableCell>
//             <StyledTableCell align="center">{courseData.batch || "N/A"}</StyledTableCell>
//             <StyledTableCell align="center">
//               {currency} {convertAmount(courseData.amount)}
//             </StyledTableCell>
//             <StyledTableCell align="center">{courseData.discount || "0"}</StyledTableCell>
//             <StyledTableCell align="center">
//               {currency} {convertAmount(courseData.total)}
//             </StyledTableCell>
//             <StyledTableCell align="center">
//               <RiDeleteBinLine style={{ color: 'red', cursor: 'pointer' }} />
//             </StyledTableCell>
//           </StyledTableRow>
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { RiDeleteBinLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Blogs.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3", // Grey color for the table header
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.black, // Text color for table columns
    border: `1px solid ${theme.palette.common.black}`, // White border for each cell
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

export default function EnrollmentTable() {
  const { courseName } = useParams(); // Get selected course from URL
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.hachion.co/courses/all");

        // Match course from URL
        const matchedCourse = response.data.find(
          (c) =>
            c.courseName.toLowerCase().replace(/\s+/g, "-") ===
            courseName.toLowerCase().replace(/\s+/g, "-")
        );

        if (matchedCourse) {
          setCourseData(matchedCourse);
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>No matching course found.</div>;

  return (
    <TableContainer component={Paper}>
      <Table
        className="table-details"
        sx={{ minWidth: 700 }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Batch</StyledTableCell>
            <StyledTableCell align="center">Fee</StyledTableCell>
            <StyledTableCell align="center">% Discount</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow key={courseData.courseName}>
            <StyledTableCell component="th" scope="row" align="center">
              {courseData.courseName}
            </StyledTableCell>
            <StyledTableCell align="center">
              {courseData.batch || "N/A"}
            </StyledTableCell>
            <StyledTableCell align="center">
              USD {courseData.amount}
            </StyledTableCell>
            <StyledTableCell align="center">
              {courseData.discount || "0"}
            </StyledTableCell>
            <StyledTableCell align="center">
              USD {courseData.total}
            </StyledTableCell>
            <StyledTableCell align="center">
              <RiDeleteBinLine style={{ color: "red", cursor: "pointer" }} />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
