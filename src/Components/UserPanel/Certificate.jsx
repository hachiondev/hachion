import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiDownload } from "react-icons/fi";
import './Dashboard.css';

export default function Certificate() {
  const [certificates, setCertificates] = React.useState([]);

  // Fetch student name from localStorage
  const loginuserData = JSON.parse(localStorage.getItem('loginuserData'));
  const studentName = loginuserData?.name || ''; // Extract student name

  // Fetch certificates data on component mount
  React.useEffect(() => {
    const fetchCertificates = async () => {
      if (!studentName) {
        console.log("Student name is not available in localStorage.");
        return;
      }

      try {
        // Fetch data using studentName in the URL
        const response = await fetch(`https://api.hachion.co/certificate/byname/${studentName}`);
        const data = await response.json();

        if (response.ok) {
          setCertificates(data);
        } else {
          console.error("Error fetching certificates:", data.message);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, [studentName]); // Runs when the component mounts or when studentName changes

  return (
    <>
      <div className='courses-enrolled'>
        <nav className='dashboard-nav'>
          Download Certificate
        </nav>
      </div>
      <div className="resume-div">
        <div className='resume-div-table'>
          <TableContainer component={Paper}>
            <Table className='resume-table' aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{width: '50px'}}>S.No.</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">Course Status</TableCell>
                  <TableCell align="center">Completion Date</TableCell>
                  <TableCell align="center" style={{width: '60px'}}>Certificate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.map((certificate, index) => (
                  <TableRow key={certificate.certificateId}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{certificate.courseName}</TableCell>
                    <TableCell align="center">{certificate.status}</TableCell>
                    <TableCell align="center">{certificate.completionDate}</TableCell>
                    <TableCell align="center">
                    <a
    href={`https://api.hachion.co/download/filename/${certificate.certificatePath.replace('certificates/', '')}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FiDownload className='invoice-icon' />
  </a>
                    </TableCell>
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