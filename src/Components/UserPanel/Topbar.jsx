import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style.css';

const Topbar = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        
        const res = await fetch('https://api.country.is');
        if (!res.ok) throw new Error('Failed to fetch location data');
        const data = await res.json();

        
        const code = (data.country || '').toUpperCase();

        if (code === 'IN') {
          setWhatsappNumber('+91-949-032-3388');
          setWhatsappLink('https://wa.me/919490323388');
        } else {
          setWhatsappNumber('+1 (732) 485-2499');
          setWhatsappLink('https://wa.me/17324852499');
        }
      } catch (error) {
        
        setWhatsappNumber('+1 (732) 485-2499');
        setWhatsappLink('https://wa.me/17324852499');
      }
    };

    detectUserCountry();
  }, []);

  return (
    <div
      className="topbar-wrapper w-100"
      style={{ background: "#0C8EBF", height: "45px" }}
    >
      <div className="container d-flex justify-content-between align-items-center text-white px-3 h-100">
        {/* Left Section */}
        <div className="d-flex align-items-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-underline text-white me-3"
            aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
          >
            <FaPhone className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">{whatsappNumber}</span>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-underline text-white"
            aria-label="Send an email to trainings@hachion.co using Gmail"
          >
            <IoIosMail className="me-1 topbar-icon text-white" />
            <span className="fw-normal topbar-text">trainings@hachion.co</span>
          </a>
        </div>

        {/* Right Section */}
        <div className="d-none d-md-block">
          <Link
            to="/corporate"
            className="btn btn-md text-white text-decoration-underline text-nowrap "
          >
            Corporate Training
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Topbar;
