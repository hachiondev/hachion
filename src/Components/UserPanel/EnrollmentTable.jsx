import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d3d3d3',
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.common.black,
    border: `1px solid ${theme.palette.common.black}`,
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

export default function EnrollmentTable() {
  const { courseName } = useParams();
  const location = useLocation();
  const modeType = location.state?.modeType || '';

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("✅ courseName from URL:", courseName);
  console.log("✅ modeType from location.state:", modeType);
  console.log("✅ Full location.state object:", location.state);

  useEffect(() => {
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.hachion.co/courses/all');
      console.log("📦 All courses from backend:", response.data);

      const matchedCourse = response.data.find((c) => {
        const courseSlug = c.courseName?.toLowerCase().replace(/\s+/g, '-');
        const paramSlug = courseName.toLowerCase().replace(/\s+/g, '-');
        const match = courseSlug === paramSlug;

        console.log(`🔍 Trying match:
  - courseName: "${c.courseName}" → slug: "${courseSlug}"
  - Match with paramSlug: "${paramSlug}"
  - Match Result: ${match}
  `);

        return match;
      });

      if (matchedCourse) {
        console.log("✅ Matched Course:", matchedCourse);
        setCourseData(matchedCourse);
      } else {
        console.warn("❌ No course matched the courseName.");
      }
    } catch (error) {
      console.error('🔥 Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourseData();
}, [courseName]);


  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>No matching course found.</div>;

const modeTypeLabels = {
  live: "Live Training",
  crash: "Crash Course (Fast Track)",
  mentoring: "Mentoring Mode",
  selfqa: "Self-paced with Q&A",
  self: "Self-paced Learning",
};

  return (
    <TableContainer component={Paper}>
      <Table className='table-details' sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Batch</StyledTableCell>
            <StyledTableCell align="center">Mode</StyledTableCell>
            <StyledTableCell align="center">Fee</StyledTableCell>
            <StyledTableCell align="center">% Discount</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow key={courseData.courseName}>
            <StyledTableCell component="th" scope="row" align="center">
              {courseData.courseName}
            </StyledTableCell>
            <StyledTableCell align="center">{courseData.batch || "N/A"}</StyledTableCell>
   <StyledTableCell align="center">{modeTypeLabels[modeType] || 'N/A'}</StyledTableCell>
            {/* Fee */}
            <StyledTableCell align="center">
              USD {
                parseFloat(
                  modeType === 'mentoring' ? courseData.mamount :
                  modeType === 'self' ? courseData.samount :
                  modeType === 'selfqa' ? courseData.sqamount :
                  modeType === 'crash' ? courseData.camount :
                  courseData.amount || 0
                ).toFixed(2)
              }
            </StyledTableCell>

            {/* Discount */}
            <StyledTableCell align="center">
              {
                modeType === 'mentoring' ? courseData.mdiscount :
                modeType === 'self' ? courseData.sdiscount :
                modeType === 'selfqa' ? courseData.sqdiscount :
                modeType === 'crash' ? courseData.cdiscount :
                courseData.discount || 0
              }
            </StyledTableCell>

            {/* Total */}
            <StyledTableCell align="center">
              USD {
                parseFloat(
                  modeType === 'mentoring' ? courseData.mtotal :
                  modeType === 'self' ? courseData.stotal :
                  modeType === 'selfqa' ? courseData.sqtotal :
                  modeType === 'crash' ? courseData.ctotal :
                  courseData.total || 0
                ).toFixed(2)
              }
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
