"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./CoursePage/Course.css";
import "./Blogs.css";
import axios from "axios";

// CRA's version used `useFormik` + a shared `LoginSchema` (a generic Yup
// schema reused across many unrelated forms — login/comment/company fields
// that don't even apply here). formik/yup aren't installed in this Next.js
// project; this app's own established convention (see the existing
// JobApplicationForm.jsx, and BlogInquiryForm/EnrollmentForm) is manual
// validation instead of adding those as new dependencies for one form.
// The actual submit-blocking validation in CRA's handleContact was just
// "resume attached + checkbox checked" anyway (errors.name/errors.email were
// computed by formik but never gated submission), so manual validation here
// covers the same real requirements plus the two fields that did have
// visible inline errors.
const validateName = (name) => (!name || name.trim().length < 2 ? "Please enter your name" : "");
const validateEmail = (email) => {
  if (!email) return "Please enter your email";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email";
};

// CRA's version, in props: this input and the file input below it shared
// the exact same `resumeInputRef` object — a real bug (only the last-mounted
// element, the file input, actually keeps the ref; the mobile-number input's
// ref attribute was a silent no-op). Fixed by only attaching the ref where
// it's actually used (clearing the file input after a successful submit).
const ApplyForm = ({ job }) => {
  const router = useRouter();
  const { jobId, jobTitle, companyName, image } = job || {};

  const [values, setValues] = useState({ name: "", email: "", resume: null });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [mobileNumber, setMobileNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";
    if (!userEmail) {
      window.confirm("Please login before applying");
      router.push("/login");
      return;
    }
    // Syncs from localStorage (an external source).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues((prev) => ({ ...prev, email: userEmail }));
    if (userEmail && jobId) {
      fetch(`https://api.hachion.co/apply-job/check?jobId=${jobId}&email=${userEmail}`)
        .then((res) => res.json())
        .then((isApplied) => setAlreadyApplied(isApplied))
        .catch((err) => console.error("Error checking job application status:", err));
    }
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://api.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setValues((prev) => ({ ...prev, name: data.name || prev.name }));
        if (data.mobile) setMobileNumber(data.mobile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      name: name === "name" ? validateName(values.name) : prev.name,
      email: name === "email" ? validateEmail(values.email) : prev.email,
    }));
  };

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
    const formData = new FormData();
    formData.append("resume", values.resume);
    const requestData = {
      jobId,
      jobTitle,
      companyName,
      companyLogo: image?.split("/").pop(),
      studentName: values.name,
      email: values.email,
      mobileNumber,
    };
    formData.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    try {
      const response = await axios.post(`https://api.hachion.co/apply-job/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccessMessage("✅ Application submitted successfully!");
        setErrorMessage("");
        setValues((prev) => ({ ...prev, resume: null }));
        if (resumeInputRef.current) {
          resumeInputRef.current.value = null;
        }
        setIsChecked(false);
        setAlreadyApplied(true);
      }
    } catch (err) {
      setErrorMessage("❌ Failed to submit your application. Please try again later.");
      setSuccessMessage("");
      console.error("Error submitting application:", err);
    }
  };

  return (
    <div className="student-reg-form">
      <form onSubmit={handleContact}>
        <div className="form-group col-10">
          <label htmlFor="studentregName" className="form-label">
            Full Name<span className="required">*</span>
          </label>
          <input type="text" className="form-control-student" id="studentregName" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your full name" />
          {errors.name && touched.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group col-10">
          <label htmlFor="studentregEmail" className="form-label">
            Email ID<span className="required">*</span>
          </label>
          <input type="email" className="form-control-student" id="studentregEmail" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="abc@gmail.com" />
          {errors.email && touched.email && <p className="form-error">{errors.email}</p>}
        </div>

        <label className="form-label">Mobile Number<span className="required">*</span></label>
        <div className="input-group mb-3 custom-width">
          <input type="tel" className="form-control-student" id="studentregMobile" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Enter your mobile number" />
        </div>

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
            onChange={(event) => setValues((prev) => ({ ...prev, resume: event.currentTarget.files[0] }))}
          />
          <p className="example">(.pdf, .txt, .doc, .docx, .rtf)</p>
        </div>

        {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
        {alreadyApplied ? (
          <button className="student-register-button applied" type="button" disabled style={{ backgroundColor: "#4BB543", color: "white", cursor: "default" }}>
            ✅ Applied
          </button>
        ) : (
          <button className="student-register-button" type="submit">
            Apply Now
          </button>
        )}
        {error && <p className="error-message">{error}</p>}

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
            <Link href="/privacy" style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}>
              Privacy Notice
            </Link>{" "}
            and{" "}
            <Link href="/terms" style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}>
              Terms & Conditions
            </Link>
          </label>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;
