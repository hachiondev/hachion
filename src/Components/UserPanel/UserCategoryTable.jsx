import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Dashboard.css';

export default function UserCategoryTable() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loginuserData'));
        const email = user?.email;

        if (!email) return;

        const response = await axios.get('https://api.test.hachion.co/enroll');
        const allEnrollments = response.data;

        const currentDate = new Date().setHours(0, 0, 0, 0);

        // Show all enrollments of the logged-in user
        const userEnrollments = allEnrollments
          .filter((enrollment) => enrollment.email === email)
          .map((enrollment) => {
            const enrollDate = new Date(enrollment.enroll_date).setHours(0, 0, 0, 0);
            const status = enrollDate >= currentDate ? 'Upcoming Demo' : 'Enrolled to Demo';

            return {
              ...enrollment,
              status,
            };
          });

        setEnrollments(userEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <>
      <div className="courses-enrolled">
        <nav className="dashboard-nav">Courses Enrolled</nav>
      </div>
      <div className="resume-div">
        <div className="resume-div-table">
          <TableContainer component={Paper}>
            <Table className="resume-table" aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No.</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Week</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">Mode</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.course_name}</TableCell>
                    <TableCell align="center">{row.enroll_date}</TableCell>
                    <TableCell align="left">{row.week || '-'}</TableCell>
                    <TableCell align="left">{row.time}</TableCell>
                    <TableCell align="center">{row.mode}</TableCell>
                    <TableCell align="center" style={{ color: row.status === 'Upcoming Demo' ? 'green' : 'gray' }}>
                      {row.status}
                    </TableCell>
                  </TableRow>
                ))}
                {enrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No enrolled courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
