import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { LiaStarSolid } from "react-icons/lia";
import UserWriteReview from './UserWriteReview';
import './Dashboard.css';

function createData(S_No, course_name, Rating, Reviews) {
  return { S_No, course_name, Rating, Reviews };
}

const rows = [
  createData(1, 'QA Automation', <LiaStarSolid style={{ color: 'gold' }} />, 'I found the correct platform for online training.'),
  createData(2, 'Python', <LiaStarSolid style={{ color: 'gold' }} />, 'Industry exposure live projects intensified my practical skills.'),
];

export default function UserReviews() {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <>
      {!showReviewForm && (
        <div className='courses-enrolled'>
          <nav className='dashboard-nav'>
            <div className='courses-review'>
              Reviews
              <button className='write-btn' onClick={() => setShowReviewForm(true)}>Write Review</button>
            </div>
          </nav>
        </div>
      )}

      <div className='content-wrapper' style={{ display: 'flex', flexDirection: 'row' }}>
        <div className='resume-div' style={{ flex: 1 }}>
          {!showReviewForm ? (
            <TableContainer component={Paper}>
              <Table className='resume-table' aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S.No.</TableCell>
                    <TableCell align="center">Course Name</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Reviews</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.S_No}>
                      <TableCell align="center">{row.S_No}</TableCell>
                      <TableCell align="left">{row.course_name}</TableCell>
                      <TableCell align="center">{row.Rating}</TableCell>
                      <TableCell align="left">{row.Reviews}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <UserWriteReview setShowReviewForm={setShowReviewForm} />
          )}
        </div>
      </div>
    </>
  );
}
