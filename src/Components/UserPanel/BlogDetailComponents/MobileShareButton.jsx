// ========== MOBILE SHARE COMPONENT (WITH REACT ICONS) ==========
// Add this component near the top of your file, after the other component definitions

import { useState } from "react";
import { 
  FaWhatsapp, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaYoutube, 
  FaEnvelope,
  FaShareAlt,
  FaTimes,
  FaLink
} from "react-icons/fa";

// ✅ MOBILE-ONLY SHARE BUTTON COMPONENT
const MobileShareButton = ({selectedBlog}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const blogUrl = window.location.href;
  const blogTitle = selectedBlog?.title || document.title || "Hachion Blog";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share handlers for each platform
  const handleShare = {
    facebook: () => window.open(`https://www.facebook.com/hachion.co`, "_blank"),
    twitter: () => window.open(`https://x.com/hachion_co`, "_blank"),
    linkedin: () => window.open(`https://www.linkedin.com/company/hachion`, "_blank"),
    whatsapp: () => window.open(`https://whatsapp.com/channel/0029VbBClUlKbYMFEaRnjp28`, "_blank"),
    youtube: () => window.open("https://www.youtube.com/@hachion", "_blank"),
    email: () => {
      const emailSubject = "Check out this blog!";
      const emailBody = `I thought you might like this blog: ${blogUrl}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailUrl, "_blank");
    },
  };

  return (
    <>
      {/* Mobile Share Trigger Button - Only visible on mobile */}
      <div 
        className="multimedia-option-open mobile-only" 
        id="multimediaoptionOpen"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaShareAlt size={20} color="#fff" />
      </div>

      {/* Mobile Share Modal - Only visible on mobile when open */}
      {isOpen && (
        <div className="multimedia-option-container mobile-only">
          <div className="multimedia-option-header">
            <div className="cart-indicater">
              <img 
                src="/HachionLogo.png" 
                alt="share" 
                width="40" 
                height="40" 
              />
            </div>
            <div className="cart-heading">
              <h4>{blogTitle}</h4>
              <p>hachion.co</p>
            </div>
            <div 
              className="close-cart" 
              id="closeCart"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes size={14} color="#666" />
            </div>
          </div>
          
          <div className="multimedia-option-body">
            <div className="share-multimedia-option">
              {/* WhatsApp */}
              <div 
                onClick={handleShare.whatsapp}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="whatsapp circle">
                  <FaWhatsapp size={24} color="#fff" />
                </div> 
                Whatsapp
              </div>

              {/* LinkedIn */}
              <div 
                onClick={handleShare.linkedin}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="linkedin circle">
                  <FaLinkedin size={24} color="#fff" />
                </div> 
                Linkedin
              </div>

              {/* Twitter */}
              <div 
                onClick={handleShare.twitter}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="twitter circle">
                  <FaTwitter size={24} color="#fff" />
                </div> 
                Twitter
              </div>

              {/* Facebook */}
              <div 
                onClick={handleShare.facebook}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="facebook circle">
                  <FaFacebook size={24} color="#fff" />
                </div> 
                Facebook
              </div>

              {/* YouTube */}
              <div 
                onClick={handleShare.youtube}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="youtube circle">
                  <FaYoutube size={24} color="#fff" />
                </div> 
                YouTube
              </div>

              {/* Email */}
              <div 
                onClick={handleShare.email}
                className="circle-icon"
                style={{ cursor: 'pointer' }}
              >
                <div className="email circle">
                  <FaEnvelope size={24} color="#fff" />
                </div> 
                Email
              </div>
            </div>
            
            <div>
              <button 
                className="link-button copy_link"
                onClick={handleCopyLink}
              >
                <span className="copy_text">{copied ? 'Copied!' : 'Copy Link!'}</span>
                <FaLink size={16} color="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileShareButton;