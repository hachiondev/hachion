// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Radio from '@mui/material/Radio';
// import payumoney from '../../Assets/payumoney.png';
// import './Blogs.css';

// const countryToCurrencyMap = {
//   'IN': 'INR',
//   'US': 'USD',
//   'GB': 'GBP',
//   'AU': 'AUD',
//   'CA': 'CAD',
//   'EU': 'EUR'
// };

// export default function TotalOrder() {
//   const { courseName } = useParams(); // Get selected course from URL
//   const [courseData, setCourseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedValue, setSelectedValue] = useState('a'); // Default selection for Radio
// const [currency, setCurrency] = useState('USD');
//   const [exchangeRate, setExchangeRate] = useState(1);

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
//         const response = await axios.get('http://localhost:8080/courses/all');
        
//         // Match course from URL
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
//   const convertAmount = (amount) => (amount * exchangeRate).toFixed(2);
//   const handleChange = (event) => {
//     setSelectedValue(event.target.value);
//   };

//   return (
//     <>
//       <TableContainer component={Paper} className="table-container">
//         <Table aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell className="table-cell-left">Course Name</TableCell>
//               <TableCell align="right" className="table-cell-right">
//                 {courseData.courseName}
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell className="table-cell-left">Course Fee</TableCell>
//               <TableCell align="right" className="table-cell-right">
//               {currency} {convertAmount(courseData.amount)}
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="table-cell-left">% Discount</TableCell>
//               <TableCell align="right" className="table-cell-right">
//                 {courseData.discount || "N/A"}
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="table-cell-left">Total</TableCell>
//               <TableCell align="right" className="table-cell-right">
//               {currency} {convertAmount(courseData.total)}
//               </TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="table-cell-left">Tax</TableCell>
//               <TableCell align="right" className="table-cell-right">
//                 {courseData.tax || "N/A"}
//               </TableCell>
//             </TableRow>
//             {/* Net Payable Amount Row */}
//             <TableRow className="net-amount">
//               <TableCell className="net-amount-left">Net Payable amount:</TableCell>
//               <TableCell align="right" className="net-amount-right">
//               {currency} {convertAmount(courseData.total)}
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <div className="radio-group">
//         <Radio
//           checked={selectedValue === 'a'}
//           onChange={handleChange}
//           value="a"
//           name="radio-buttons"
//           inputProps={{ 'aria-label': 'A' }}
//         />
//         <img src={payumoney} alt="payumoney" />
//       </div>
      
//       <button className="payment-btn">Proceed to Pay</button>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import payumoney from '../../Assets/payumoney.png';
import './Blogs.css';

export default function TotalOrder() {
  const { courseName } = useParams(); // Get selected course from URL
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState('a'); // Default selection for Radio

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
        
        // Match course from URL
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName.toLowerCase().replace(/\s+/g, '-')
        );

        if (matchedCourse) {
          setCourseData(matchedCourse);
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>No matching course found.</div>;

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="table-cell-left">Course Name</TableCell>
              <TableCell align="right" className="table-cell-right">
                {courseData.courseName}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="table-cell-left">Course Fee</TableCell>
              <TableCell align="right" className="table-cell-right">
                USD {courseData.amount || "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell-left">% Discount</TableCell>
              <TableCell align="right" className="table-cell-right">
                {courseData.discount || "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell-left">Total</TableCell>
              <TableCell align="right" className="table-cell-right">
               USD {courseData.total || "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="table-cell-left">Tax</TableCell>
              <TableCell align="right" className="table-cell-right">
               USD {courseData.tax || "N/A"}
              </TableCell>
            </TableRow>
            {/* Net Payable Amount Row */}
            <TableRow className="net-amount">
              <TableCell className="net-amount-left">Net Payable amount:</TableCell>
              <TableCell align="right" className="net-amount-right">
               USD  {courseData.total || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <div className="radio-group">
        <Radio
          checked={selectedValue === 'a'}
          onChange={handleChange}
          value="a"
          name="radio-buttons"
          inputProps={{ 'aria-label': 'A' }}
        />
        <img src={payumoney} alt="payumoney" />
      </div>
      
      <button className="payment-btn">Proceed to Pay</button>
    </>
  );
}