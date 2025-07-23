import React, { useState, useEffect } from 'react';
import './Course.css';
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import whatsapp from '../../Assets/logos_whatsapp-icon.png';
import HaveAnyQuery from './HaveAnyQuery';

const StickyBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (!res.ok) throw new Error('Failed to fetch location data');

        const data = await res.json();
        console.log('🌍 Country from ipwho.is:', data.country_code);

        if (data.country_code === 'IN') {
          setWhatsappNumber('+91-949-032-3388');
          setWhatsappLink('https://wa.me/919490323388');
        } else {
          setWhatsappNumber('+1 (732) 485-2499');
          setWhatsappLink('https://wa.me/17324852499');
        }
      } catch (error) {
        console.error('❌ Location fetch error:', error);
        setWhatsappNumber('+1 (732) 485-2499');
        setWhatsappLink('https://wa.me/17324852499');
      }
    };

    detectUserCountry();
  }, []);

  return (
    <>
      <div className="sticky-bar">
        <div className="contact-info">
          <p className='query-content' style={{ marginBottom: '0' }}>Have any query ?</p>

          <div className="whatsapp-container">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
              aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
            >
              <img src={whatsapp} alt="whatsapp-icon" className="whatsapp-icon" aria-hidden="true"/>
              <p className="whatsapp-number-footer">{whatsappNumber}</p>
            </a>
          </div>

          <PiLineVerticalThin style={{ color: 'white', fontSize: '2rem' }} />
          <IoIosMail className='training-mail-icon' />
          <p className='training-email-footer'>
            <a
              href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send an email to trainings@hachion.co using Gmail"
              title="Email trainings@hachion.co"
            >
              trainings@hachion.co
            </a>
          </p>
        </div>

        <button className="contact-button" onClick={openModal}>Contact Us</button>
      </div>

      {isModalOpen && <HaveAnyQuery closeModal={closeModal} />}
    </>
  );
};

export default StickyBar;