import React, { useState, useEffect } from 'react';
import './Course.css';
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import whatsapp from '../../Assets/logos_whatsapp-icon.png';
import HaveAnyQuery from './HaveAnyQuery';
import facebook from '../../Assets/facebook.png';
import twitter from '../../Assets/twitter.png';
import youtube from '../../Assets/youtube.png';
import linkedin from '../../Assets/linkedin.png';
import instagram from '../../Assets/instagram.png';
import quora from '../../Assets/Component 141.png';
import {  useNavigate } from 'react-router-dom';

const StickyBar = () => {
  const navigate= useNavigate();
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

     const handleTerms=()=>{
    navigate('/terms')
  }
   const handlePrivacy=()=>{
    navigate('/privacy')
  }
    const handleUnsubscribe = () => {
    navigate("/unsubscribe");
  };

  return (
    <>
      <div className="sticky-bar">
          <div className="container d-flex align-items-center justify-content-between flex-wrap">

          <div className="whatsapp-container">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
              aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
            >
              <img src={whatsapp} alt="whatsapp-icon" className="whatsapp-icon" aria-hidden="true"/>
              <p className="text-decoration-underline whatsapp-number-footer">{whatsappNumber}</p>
            </a>
          </div>

          {/* <PiLineVerticalThin style={{ color: 'white', fontSize: '2rem' }} /> */}
          {/* <IoIosMail className='training-mail-icon' />
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
          </p> */}
          <p className='query-content'>Have any query ?</p>
        {/* <div className='footer-p'> */}
              <p className='footer-copyright-desktop'>© Hachion 2025. All Rights Reserved.</p>
              {/* <div className='term'>
              <p className='footer-term' onClick={handleTerms}>Terms and Conditions</p>
              <p className='footer-term' onClick={handlePrivacy}>Privacy Policy</p>
              <p className="footer-term" onClick={handleUnsubscribe}>Unsubscribe</p>
              </div> */}
              <div className='footer-link'>
              <a href="https://www.facebook.com/hachion.co" aria-label="Facebook"
            target="_blank" 
            rel="noopener noreferrer"><img src={facebook} alt='facebook-icon' loading="lazy"/></a>
            <a href="https://x.com/hachion_co" aria-label="Twitter"
            target="_blank" 
            rel="noopener noreferrer"><img src={twitter} alt='twitter-icon' loading="lazy"/></a>
            <a href="https://www.linkedin.com/company/hachion" aria-label="Linkedin"
            target="_blank" 
            rel="noopener noreferrer"><img src={linkedin} alt='linkedin-icon' loading="lazy"/></a>
            <a href="https://www.instagram.com/hachion_trainings" aria-label="Instagram"
            target="_blank" 
            rel="noopener noreferrer"><img src={instagram} alt='instagram-icon' loading="lazy"/></a>
            <a href="https://www.quora.com/profile/Hachion" aria-label="Quora"
            target="_blank" 
            rel="noopener noreferrer"><img src={quora} alt='quora-icon' loading="lazy"/></a>
              <a href="https://www.youtube.com/@hachion" aria-label="YouTube"
            target="_blank" 
            rel="noopener noreferrer"><img src={youtube} alt='youtube' loading="lazy"/></a>
              </div>
              <p className='footer-copyright-mobile'>© Hachion 2025. All Rights Reserved.</p>
        </div>
        </div>
        {/* <button className="contact-button" onClick={openModal}>Contact Us</button> */}
      {/* </div> */}

      {/* {isModalOpen && <HaveAnyQuery closeModal={closeModal} />} */}
    </>
  );
};

export default StickyBar;