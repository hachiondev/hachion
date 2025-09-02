import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style.css';

const TopBarNew = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (!res.ok) throw new Error('Failed to fetch location data');

        const data = await res.json();
        if (data.country_code === 'IN') {
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
      className="container-fluid d-flex justify-content-between align-items-center text-white px-3 px-md-5"
      style={{ background: "#0C8EBF", height: "45px" }}
    >
      {/* Left Section */}
      <div className="d-flex align-items-center">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center text-decoration-none text-white me-3"
          aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
        >
          <FaPhone className="me-1 topbar-icon text-white" />
          <span className="fw-normal topbar-text">{whatsappNumber}</span>
        </a>

        <a
          href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center text-decoration-none text-white"
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
          className="btn btn-md text-white text-nowrap "
        >
          Corporate Training
        </Link>
      </div>
    </div>
  );
};

export default TopBarNew;
