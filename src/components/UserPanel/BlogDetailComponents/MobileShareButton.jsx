"use client";

import { useState } from "react";
import {
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaShareAlt,
  FaTimes,
  FaLink
} from "react-icons/fa";

// Mobile-only share button — desktop already has its own icon row rendered
// directly in BlogDetails.jsx; this adds a copy-link option desktop lacks.
const MobileShareButton = ({ selectedBlog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // Always share the production URL (never the localhost/staging host the
  // app happens to be running on) so social crawlers can actually fetch it.
  const blogUrl = `https://www.hachion.co${typeof window !== "undefined" ? window.location.pathname : ""}`;
  const blogTitle = selectedBlog?.title || (typeof document !== "undefined" ? document.title : "") || "Hachion Blog";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share handlers for each platform — open the platform's native share
  // dialog for this blog (pre-filled with its URL/title), not Hachion's page
  const handleShare = {
    facebook: () =>
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      ),
    twitter: () =>
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blogTitle)}&via=hachionofficial`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      ),
    linkedin: () =>
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
        "_blank",
        "noopener,noreferrer,width=600,height=600"
      ),
    whatsapp: () =>
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${blogTitle} ${blogUrl}`)}`,
        "_blank",
        "noopener,noreferrer"
      ),
    email: () => {
      const emailSubject = blogTitle;
      const emailBody = `I thought you might like this blog: "${blogTitle}"\n\n${blogUrl}`;
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
                src="/Hachion-logo.png"
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
