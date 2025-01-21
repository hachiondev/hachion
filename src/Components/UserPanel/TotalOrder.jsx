// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Radio from '@mui/material/Radio';
// import payumoney from '../../Assets/payumoney.png';

// function createData(course_name, qa_automation) {
//   return { course_name, qa_automation };
// }

// const rows = [
//   createData('Fee:', 37383),
//   createData('%Discount:', 0),
//   createData('Total:', 37383),
//   createData('GST(18%):', 2000),
// ];


// export default function TotalOrder() {
//   const [selectedValue, setSelectedValue] = React.useState('a');

// const handleChange = (event) => {
//   setSelectedValue(event.target.value);
// };
//   return (<>
//     <TableContainer component={Paper}>
//       <Table sx={{ maxWidth: 450, borderCollapse: 'collapse',marginLeft:'40px' }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ border: 'none', padding: '4px 8px',fontWeight:'700' }}>Course Name</TableCell>
//             <TableCell align="right" sx={{ border: 'none', padding: '4px 8px' }}>Qa Automation</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <TableRow
//               key={row.course_name}
//               sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}
//             >
//               <TableCell component="th" scope="row" sx={{ border: 'none', padding: '4px 8px',fontWeight:'700' }}>
//                 {row.course_name}
//               </TableCell>
//               <TableCell align="right" sx={{ border: 'none', padding: '4px 8px' }}>
//                 {row.qa_automation}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <div className='net-amount'>
//      <p>Net Payable amount: 39383</p>
//     </div>
//     <div className='radio-group'>
//     <Radio
//         checked={selectedValue === 'a'}
//         onChange={handleChange}
//         value="a"
//         name="radio-buttons"
//         inputProps={{ 'aria-label': 'A' }}
//       />
//       <img src={payumoney} alt='payumoney'/>
//       </div>
//       <button className='payment-btn'>Proceed to Pay</button>
//   </>);
// }

import * as React from 'react';
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

function createData(course_name, qa_automation) {
  return { course_name, qa_automation };
}

const rows = [
  createData('Fee:', 37383),
  createData('%Discount:', 0),
  createData('Total:', 37383),
  createData('GST(18%):', 2000),
];

export default function TotalOrder() {
  const [selectedValue, setSelectedValue] = React.useState('a');

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
              <TableCell align="right" className="table-cell-right">Qa Automation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.course_name}>
                <TableCell component="th" scope="row" className="table-cell-left">
                  {row.course_name}
                </TableCell>
                <TableCell align="right" className="table-cell-right">
                  {row.qa_automation}
                </TableCell>
              </TableRow>
            ))}
            {/* Net Payable Amount Row */}
            <TableRow className="net-amount">
              <TableCell className="net-amount-left">Net Payable amount:</TableCell>
              <TableCell align="right" className="net-amount-right">39383</TableCell>
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

