import React from 'react';
import '../../Components/UserPanel/Course.css';
import whatsapp from '../../Assets/logos_whatsapp-icon.webp';
import facebook from '../../Assets/facebook.webp';
import twitter from '../../Assets/twitter.webp';
import youtube from '../../Assets/youtube.webp';
import linkedin from '../../Assets/linkedin.webp';
import instagram from '../../Assets/instagram.webp';
import quora from '../../Assets/Component 141.webp';
import { useNavigate } from 'react-router-dom';

// TanStack Query Hook (same as Footer)
import { useTopBarApi } from '../../Api/hooks/HomePageApi/useTopBarApi';

const StickyBar = () => {
  const navigate = useNavigate();
  
  // Use the same TanStack Query hook as Footer
  const { whatsappNumber, whatsappLink } = useTopBarApi();

  // -------------------------
  // 🔗 Navigation Handlers
  // -------------------------
  const handleTerms = () => {
    navigate('/terms');
  };

  const handlePrivacy = () => {
    navigate('/privacy');
  };

  const handleUnsubscribe = () => {
    navigate('/unsubscribe');
  };

  return (
    <div className="sticky-bar">
      <div className="container d-flex align-items-center justify-content-between flex-wrap">
        
        {/* ----------------------- */}
        {/* WHATSAPP CONTACT        */}
        {/* ----------------------- */}
        <div className="whatsapp-container">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
            aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
          >
            <img 
              src={whatsapp} 
              alt="whatsapp-icon" 
              className="whatsapp-icon" 
              aria-hidden="true"
              loading="lazy"
            />
            <p className="text-decoration-underline whatsapp-number-footer">
              {whatsappNumber}
            </p>
          </a>
        </div>

        {/* ----------------------- */}
        {/* QUERY TEXT              */}
        {/* ----------------------- */}
        <p className="query-content">Have any query?</p>

        {/* ----------------------- */}
        {/* COPYRIGHT (Desktop)     */}
        {/* ----------------------- */}
        <p className="footer-copyright-desktop">
          © Hachion 2025. All Rights Reserved.
        </p>

        {/* ----------------------- */}
        {/* SOCIAL MEDIA LINKS      */}
        {/* ----------------------- */}
        <div className="footer-link">
          <a 
            href="https://www.facebook.com/hachion.co" 
            aria-label="Facebook"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="facebook-icon" loading="lazy" />
          </a>
          
          <a 
            href="https://x.com/hachion_co" 
            aria-label="Twitter"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={twitter} alt="twitter-icon" loading="lazy" />
          </a>
          
          <a 
            href="https://www.linkedin.com/company/hachion" 
            aria-label="Linkedin"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={linkedin} alt="linkedin-icon" loading="lazy" />
          </a>
          
          <a 
            href="https://www.instagram.com/hachion_trainings" 
            aria-label="Instagram"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={instagram} alt="instagram-icon" loading="lazy" />
          </a>
          
          <a 
            href="https://www.quora.com/profile/Hachion" 
            aria-label="Quora"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={quora} alt="quora-icon" loading="lazy" />
          </a>
          
          <a 
            href="https://www.youtube.com/@hachion" 
            aria-label="YouTube"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={youtube} alt="youtube" loading="lazy" />
          </a>
        </div>

        {/* ----------------------- */}
        {/* COPYRIGHT (Mobile)      */}
        {/* ----------------------- */}
        <p className="footer-copyright-mobile">
          © Hachion 2025. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default StickyBar;