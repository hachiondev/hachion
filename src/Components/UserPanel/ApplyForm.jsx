import React, { useEffect, useRef, useState } from 'react';
import "./Course.css";
import { AiOutlineCloseCircle, AiFillCaretDown } from "react-icons/ai";
import { Menu, MenuItem, Button } from "@mui/material";
import Flag from "react-world-flags";
import JobDetailsCard from './JobDetailsCard';
import success from "../../Assets/success.gif";
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const initialValues = {
  name: "",
  email: "",
  number: "",
  resume: "",
  date: "",
};

const ApplyForm = ({ closeModal = () => {} }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const resumeInputRef = useRef(null);
 

  const { state } = useLocation();
  const { jobId, jobTitle, companyName, image } = state || {};

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";

    if (!userEmail) {
      window.confirm("Please login before applying");
      navigate("/login");
      return;
    }

    values.email = userEmail;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://api.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();

        if (data.name) values.name = data.name;
        if (data.mobile) setMobileNumber(data.mobile);
        if (data.country) values.country = data.country;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();

     if (!values.resume) {
    setError("Please attach your resume.");
    return;
  }
    if (!isChecked) {
      setError("Please acknowledge the Privacy Notice and Terms & Conditions.");
      return;
    }

    setError("");
    const currentDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();

    if (values.resume) {
      formData.append("resume", values.resume);
    }

    const requestData = {
      jobId,
      jobTitle,
      companyName,
      companyLogo: image?.split("/").pop(),
      studentName: values.name,
      email: values.email,
      mobileNumber: mobileNumber,
    };

    formData.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

    try {
      const response = await axios.post("https://api.hachion.co/apply-job/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setShowModal(true);
        setSuccessMessage("✅ Application submitted successfully!");
        setErrorMessage("");
        setFieldValue("resume", "");
        if (resumeInputRef.current) {
          resumeInputRef.current.value = null;
        }
        setIsChecked(false);
      }
    } catch (error) {
      setErrorMessage("❌ Failed to submit your application. Please try again later.");
      setSuccessMessage("");
      console.error("Error submitting application:", error);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: () => {}, 
  });

  return (
    <div className='student-reg-form'>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group col-10">
          <label htmlFor="inputName" className="form-label">
            Full Name<span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control-student"
            id="studentreg"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
          />
          {errors.name && touched.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group col-10">
          <label htmlFor="inputEmail" className="form-label">
            Email ID<span className="required">*</span>
          </label>
          <input
            type="email"
            className="form-control-student"
            id="studentreg"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="abc@gmail.com"
          />
          {errors.email && touched.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Mobile */}
        <label className="form-label">Mobile Number<span className="required">*</span></label>
        <div className="input-group mb-3 custom-width">
          <input
            type="tel"
            className="form-control-student"
            id="studentreg"
            ref={resumeInputRef}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>

        {/* Resume */}
        <div className="form-group col-10">
          <label htmlFor="resume" className="form-label">
            Upload Resume<span className="required">*</span>
          </label>
          <input
            type="file"
            className="form-control-student"
            id="resume"
            name="resume"
            accept=".pdf, .txt, .doc, .docx, .rtf"
            ref={resumeInputRef}
            onChange={(event) => setFieldValue("resume", event.currentTarget.files[0])}
            onBlur={handleBlur}
          />
          <p className="example">(.pdf, .txt, .doc, .docx, .rtf)</p>
          {errors.resume && touched.resume && <p className="form-error">{errors.resume}</p>}
        </div>

        {/* Status Messages */}
        {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

        {/* Apply Button */}
        <button
          className="student-register-button"
          type="submit"
          onClick={handleContact}
        >
          Apply Now
        </button>
        {error && <p className="error-message">{error}</p>}

        {/* Checkbox */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckChecked"
            checked={isChecked}
            onChange={(e) => {
  setIsChecked(e.target.checked);
  setSuccessMessage(""); 
}}
            
          />
          <label className="form-check-label" htmlFor="flexCheckChecked">
            By clicking on Apply Now, you acknowledge read our{" "}
            <span onClick={() => navigate("/privacy")} style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}>
              Privacy Notice
            </span> and{" "}
            <span onClick={() => navigate("/terms")} style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}>
              Terms & Conditions
            </span>
          </label>
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
  <div className="modal" style={{ display: "block" }} onClick={() => { setShowModal(false); closeModal(false); }}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" id="#querymodal">
        <button
          className="close-btn"
          aria-label="Close"
          onClick={() => {
            setShowModal(false);
            setSuccessMessage(""); 
          }}
        >
          <RiCloseCircleLine />
        </button>
        <div className="modal-body">
          <img src={success} alt="Success" className="success-gif" />
          <p className="modal-para">Thank you! Our Team will contact you soon</p>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ApplyForm;
