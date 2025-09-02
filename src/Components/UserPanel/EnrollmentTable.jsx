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

export default function EnrollmentTable({ couponData }) {
  const { courseName } = useParams();
  const location = useLocation();
  const modeType = location.state?.modeType || '';

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName?.toLowerCase().replace(/\s+/g, '-')
        );
        setCourseData(matchedCourse || null);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName]);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await axios.get('https://ipinfo.io?token=9da91c409ab4b2');
        const country = res.data.country || 'US';

        const currencyMap = {
          IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR', AE: 'AED',
          AU: 'AUD', CA: 'CAD', JP: 'JPY', CN: 'CNY', TH: 'THB',
          RU: 'RUB', BR: 'BRL', KR: 'KRW', MX: 'MXN', SA: 'SAR', NL: 'EUR',RO: 'RON'
        };

        const userCurrency = currencyMap[country] || 'USD';
        setCurrency(userCurrency);

        if (userCurrency !== 'USD' && userCurrency !== 'INR') {
          const rateRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          const rate = rateRes.data.rates[userCurrency] || 1;
          setExchangeRate(rate);
        }
      } catch (err) {
        console.warn('Geolocation or exchange rate fetch failed. Using USD.');
        setCurrency('USD');
        setExchangeRate(1);
      }
    };

    fetchCurrency();
  }, []);


  const getField = (baseField) => {
    const prefixMap = {
      mentoring: 'm',
      self: 's',
      selfqa: 'sq',
      crash: 'c',
      live: '',
    };
    const prefix = prefixMap[modeType] || '';
    const key = currency === 'INR' ? `i${prefix}${baseField}` : `${prefix}${baseField}`;
    return courseData?.[key] ?? 0;
  };

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>No matching course found.</div>;

  const modeTypeLabels = {
    live: "Live Training",
    crash: "Crash Course (Fast Track)",
    mentoring: "Mentoring Mode",
    selfqa: "Self-paced with Q&A",
    self: "Self-paced Learning",
  };

    const baseAmount = Math.round(getField('amount') * exchangeRate);
  const baseDiscount = getField('discount') || 0;
  let finalDiscount = baseDiscount;
  let finalTotal = Math.round(getField('total') * exchangeRate);
if (couponData) {
  const type = couponData.discountType; 
  const value = couponData.discountValue || 0;

  if (type === "percent") {
    finalDiscount += value;
    finalTotal = baseAmount - (baseAmount * finalDiscount / 100);
  } else if (type === "fixed") {
    finalTotal = finalTotal + value;
    if (finalTotal < 0) finalTotal = 0;
  }
}


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
            {/* <StyledTableCell align="center">{courseData.batch || "N/A"}</StyledTableCell>
            <StyledTableCell align="center">{modeTypeLabels[modeType] || 'N/A'}</StyledTableCell>
            <StyledTableCell align="center">{Math.round(getField('amount') * exchangeRate)}</StyledTableCell>
            <StyledTableCell align="center">{getField('discount')}</StyledTableCell>
            <StyledTableCell align="center">{currency} {Math.round(getField('total') * exchangeRate)}</StyledTableCell> */}
             <StyledTableCell align="center">{courseData.batch || "N/A"}</StyledTableCell>
            <StyledTableCell align="center">{modeTypeLabels[modeType] || 'N/A'}</StyledTableCell>
            <StyledTableCell align="center">{baseAmount}</StyledTableCell>
            <StyledTableCell align="center">{finalDiscount}%</StyledTableCell>
            <StyledTableCell align="center">{currency} {Math.round(finalTotal)}</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
