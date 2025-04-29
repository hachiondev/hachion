import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Dashboard.css";

function createData(S_No, course_name, Video_link, Date) {
  return { S_No, course_name, Video_link, Date };
}

const rows = [
  createData(1, "QA Automation", "Link", "25-1-2019"),
  createData(2, "Python", "Link", "12-05-2020"),
];

export default function UserVideos() {
  return (
    <>
      <div className="courses-enrolled">
        <nav className="dashboard-nav">Videos</nav>
      </div>
      <div className="resume-div">
        <div className="resume-div-table">
          <TableContainer component={Paper}>
            <Table className="resume-table" aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No.</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">Link</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.S_No}>
                    <TableCell align="center">{row.S_No}</TableCell>
                    <TableCell align="left">{row.course_name}</TableCell>
                    <TableCell align="center">{row.Video_link}</TableCell>
                    <TableCell align="center">{row.Date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
