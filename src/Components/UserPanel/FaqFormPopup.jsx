import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const FaqFormPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const popupRef = useRef();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required.";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      name: name,
      email: email, 
      message: message
    };

    try {
      await axios.post("https://api.test.hachion.co/faq-queries", payload);
      alert("Thanks! Your question has been submitted.");
      setName("");
      setEmail("");
      setMessage("");
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again in a moment.");
    }
  };

  
  useEffect(() => {
    let parsed = {};
    try {
      parsed = JSON.parse(localStorage.getItem("loginuserData")) || {};
    } catch (e) {
      parsed = {};
    }
    const userEmail = parsed?.email || "";

    
    if (userEmail) {
      
      setEmail((prev) => (prev?.trim() ? prev : userEmail));

      
      fetch(`https://api.test.hachion.co/api/v1/user/myprofile?email=${encodeURIComponent(userEmail)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile data");
          return res.json();
        })
        .then((data) => {
          if (data?.name) {
            setName((prev) => (prev?.trim() ? prev : data.name));
          }
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
    
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="faq-popup-container" ref={popupRef}>
        {/* Header */}
        <div className="faq-popup-header">
          <button className="close-popup" onClick={onClose}>
            <IoCloseSharp size={16} />
          </button>
        </div>

        <h4>Ask a Question</h4>
        <p className="login-label">
          Didn’t find what you’re looking for? Send us your question, and we’ll get back to you soon.
        </p>

        <label className="login-label">
          Name<span className="star">*</span>
        </label>
        <div className="register-field">
          <div className="form-field">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {errors.name && <p className="error-field-message">{errors.name}</p>}
        </div>

        <label className="login-label">
          Email ID<span className="star">*</span>
        </label>
        <div className="register-field">
          <div className="form-field">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="error-field-message">{errors.email}</p>}
        </div>

        <label className="login-label">
          Message<span className="star">*</span>
        </label>
        <div className="register-field">
          <div className="form-field">
            <textarea
              className="form-control"
              placeholder="Type your question or message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {errors.message && <p className="error-field-message">{errors.message}</p>}
        </div>

        <button className="faq-popup-btn" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FaqFormPopup;
