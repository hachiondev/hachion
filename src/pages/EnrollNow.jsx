import React from 'react';
import EnrollPay from '../components/EnrollPay';
import { useNavigate } from 'react-router-dom';

export default function EnrollNow() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  const handlePayNow = (paymentData) => {
    console.log('Payment submitted:', paymentData);
    // Here you would typically send the data to your backend API
    // and handle the payment processing
  };

  return (
    <EnrollPay
      courseName="Web Developer: HTML, CSS and JavaScript"
      totalAmount="₹4,999"
      batches={['Batch 1 - Jan 2025', 'Batch 2 - Feb 2025', 'Batch 3 - Mar 2025']}
      modes={['Self-paced', 'Live Classes', 'Hybrid']}
      onClose={handleClose}
      onPayNow={handlePayNow}
    />
  );
}