import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { LiaStarSolid } from "react-icons/lia";
import UserWriteReview from './UserWriteReview'; // Import your review form component

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
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

function createData(S_No, course_name, Rating, Reviews) {
  return { S_No, course_name, Rating, Reviews };
}

const rows = [
  createData(1, 'QA Automation', <LiaStarSolid style={{ color: 'gold' }} />, 'I found the correct platform for online training.'),
  createData(2, 'Python', <LiaStarSolid style={{ color: 'gold' }} />, 'Industry exposure live projects intensified my practical skills.'),
];

export default function UserReviews() {
  const [showReviewForm, setShowReviewForm] = React.useState(false); // State to toggle between table and review form

  return (
    <>
      <div className='courses-enrolled' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <nav className='dashboard-nav'>
        Reviews</nav>
        <button className='explore-btn' onClick={() => setShowReviewForm(true)}>Write Review</button>
      </div>

      <div className='content-wrapper' style={{ display: 'flex', flexDirection: 'row' }}>
        <div className='resume-div' style={{ flex: 1 }}>
          {!showReviewForm ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1300 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell align="right">Course Name</StyledTableCell>
                    <StyledTableCell align="right">Rating</StyledTableCell>
                    <StyledTableCell align="center">Reviews</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.S_No}>
                      <StyledTableCell>{row.S_No}</StyledTableCell>
                      <StyledTableCell align="right">{row.course_name}</StyledTableCell>
                      <StyledTableCell align="right">{row.Rating}</StyledTableCell>
                      <StyledTableCell align="center">{row.Reviews}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <UserWriteReview /> 
          )}
        </div>

        {/* Add some space or a border between the table and the form */}
      </div>
    </>
  );
}