"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "./unsubscribe.css";
import { useRouter } from "next/navigation";
import { RiCloseCircleLine } from "react-icons/ri";
import { GoHeartFill } from "react-icons/go";
import { Menu, MenuItem } from "@mui/material";
import Flag from "@/components/common/CountryFlag";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "@/countryUtils";

const initialValues = {
  name: "",
  email: "",
  comment: "",
};

export default function Unsubscribe() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [values, setValues] = useState(initialValues);
  const mobileInputRef = useRef(null);
  const matchedCountry = countries.find((c) => mobileNumber.startsWith(c.code)) || selectedCountry;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getDefaultCountry("US");
    const detectAndSetCountry = async () => {
      // Don't overwrite if already selected from profile
      if (selectedCountry?.code && mobileNumber) {
        return;
      }
      try {
        const res = await fetch("https://api.country.is");
        if (!res.ok) throw new Error("Location fetch failed");
        const data = await res.json();
        data.country_code = (data.country || "").toUpperCase();
        const matched = countries.find((c) => c.flag === data?.country_code);
        if (matched) {
          setSelectedCountry(matched);
        }
      } catch {
        // geo-lookup best-effort only — keep default country on failure
      }
    };
    detectAndSetCountry();
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";

    // If logged in → autofill
    if (userEmail) {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch(`https://api.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
          const data = await res.json();
          if (res.ok) {
            setValues((prev) => ({ ...prev, email: userEmail, name: data.name || "" }));
            if (data.mobile) {
              const mobileValue = String(data.mobile).trim();

              // Example: +91 9876543210
              const parts = mobileValue.split(" ");
              if (parts.length > 1) {
                const code = parts[0];
                const number = parts.slice(1).join("");

                const matchedCountry = countries.find((c) => c.code === code);
                if (matchedCountry) {
                  setSelectedCountry(matchedCountry);
                }

                setMobileNumber(number.replace(/\D/g, ""));
              } else {
                setMobileNumber(mobileValue.replace(/\D/g, ""));
              }
            }
          }
        } catch {
          // profile prefill is best-effort only
        }
      };
      fetchUserProfile();
    } else {
      setValues((prev) => ({ ...prev, email: userEmail }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const requestBody = {
      userName: values.name,
      email: values.email,
      mobile: mobileNumber,
      reason: selectedReasons.join(", "),
      comments: values.comment,
      country: matchedCountry.name,
    };
    try {
      const res = await fetch(`https://api.hachion.co/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        setIsSubmitting(false);
        setShowModal(true);
        setValues({ name: "", email: "", comment: "" });
        setMobileNumber("");

        setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("loginuserData");
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await res.json();
        setIsSubmitting(false);

        if (errorData?.message) {
          // Remove leading "400 BAD_REQUEST" / "404 NOT_FOUND" style prefixes
          const cleanMessage = errorData.message.replace(/^\d+\s+\w+\s*/, "");
          setError(cleanMessage);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch {
      setIsSubmitting(false);
      setError("Unable to connect to the server.");
    }
  };

  const isFormValid = values.email.trim() !== "";

  return (
    <div className="unsubscribe-container">
      <div className="unsub-us-bottom-div">
        <div>
          <div className="unsubscribe-info">
            <h1 className="unsubscribe-heading">We&apos;re sorry to see you go</h1>
            <p className="unsubscribe-message">
              Please let us know the reason for your decision.
              <br />
              If you no longer wish to receive communications from us, kindly fill out the form below.
            </p>

            <p className="unsubscribe-feedback-text">
              Your feedback matters to us. If there&apos;s anything we could do better, please share your thoughts in the comments.
            </p>
          </div>
          <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">Need help?</h2>
            <p className="unsubscribe-message">
              If you unsubscribed by mistake or need assistance, feel free to contact our support team at
              <a
                href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00AEEF", marginLeft: "5px" }}
              >
                trainings@hachion.co
              </a>
              .
              <br />
              Thanks for being part of the Hachion community{" "}
              <span style={{ color: "#00AEEF" }}>
                <GoHeartFill />
              </span>
            </p>
          </div>
        </div>
        <div className="unsub-us-right">
          <div className="unsub-us-right-header">Unsubscribe</div>
          <form className="unsub-form" noValidate>
            <div className="form-group">
              <p className="login-label">Do you want to unsubscribe?</p>
            </div>
            <div>
              <label className="login-label">Full Name</label>
              <div className="register-field">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Enter your full name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">Please Enter Your Full Name.</div>
                </div>
              </div>
            </div>
            <div>
              <label className="login-label">
                Email Id<span className="required">*</span>
              </label>
              <div className="register-field">
                <div className="form-field">
                  <input
                    type="email"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Enter your emailid"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please Enter Your Email ID.</div>
                </div>
              </div>
            </div>
            <div>
              <label className="login-label">Mobile Number</label>

              <div className="register-field">
                <div className="form-field" style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAnchorEl(e.currentTarget);
                    }}
                    className="mobile-button"
                    type="button"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Flag code={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="country-flag me-1" />
                    <span style={{ marginRight: "5px", fontSize: "small" }}>
                      {selectedCountry.flag} ({selectedCountry.code})
                    </span>
                    <AiFillCaretDown />
                  </button>

                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    {countries.map((country) => (
                      <MenuItem key={country.code + country.flag} onClick={() => handleCountrySelect(country)}>
                        <Flag code={country.flag} alt={`${country.name} flag`} className="country-flag me-2" />
                        {country.name} ({country.code})
                      </MenuItem>
                    ))}
                  </Menu>

                  <input
                    type="tel"
                    ref={mobileInputRef}
                    className="form-control"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setMobileNumber(value);
                      if (value.length > 10) {
                        setMobileError("Mobile number must be 10 digits");
                      } else {
                        setMobileError("");
                      }
                    }}
                    onBlur={() => {
                      if (mobileNumber.length > 0 && mobileNumber.length !== 10) {
                        setMobileError("Mobile number must be 10 digits");
                      } else {
                        setMobileError("");
                      }
                    }}
                    placeholder="Enter your mobile number"
                    style={{ paddingLeft: "120px" }}
                    maxLength={15}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                {mobileError && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "5px", marginBottom: "0" }}>
                    {mobileError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="r1" className="login-label">
                  Reason :
                </label>

                <div className="input-group-checkbox">
                  <div className="form-check pe-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="r1"
                      value="Too many emails"
                      onChange={(e) => setSelectedReasons([e.target.value])}
                    />
                    <label className="login-label" htmlFor="r1">
                      Too many emails
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="r2"
                      value="Not relevant to me"
                      onChange={(e) => setSelectedReasons([e.target.value])}
                    />
                    <label className="login-label" htmlFor="r2">
                      Not relevant to me
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="r3"
                      value="Already enrolled / completed course"
                      onChange={(e) => setSelectedReasons([e.target.value])}
                    />
                    <label className="login-label" htmlFor="r3">
                      Already enrolled / completed course
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="r4"
                      value="Found another platform"
                      onChange={(e) => setSelectedReasons([e.target.value])}
                    />
                    <label className="login-label" htmlFor="r4">
                      Found another platform
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="reason"
                      id="r5"
                      value="Other"
                      onChange={(e) => setSelectedReasons([e.target.value])}
                    />
                    <label className="login-label" htmlFor="r5">
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="login-label" htmlFor="contactComment">
                Comments
              </label>
              <div className="register-field">
                <div className="form-field">
                  <textarea
                    className="form-control"
                    id="contactComment"
                    rows="3"
                    name="comment"
                    value={values.comment}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="u-submit-button"
                onClick={handleFormSubmit}
                disabled={!isFormValid || isSubmitting}
                style={{
                  opacity: isFormValid ? 1 : 0.5,
                  cursor: isFormValid ? "pointer" : "not-allowed",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
          {showModal && (
            <div className="modal" style={{ display: "block" }} onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content" id="#querymodal">
                  <button className="close-btn" aria-label="Close" onClick={() => setShowModal(false)}>
                    <RiCloseCircleLine />
                  </button>
                  <div className="modal-body">
                    <Image src="/images/success.gif" alt="Success" className="success-gif" width={60} height={60} unoptimized />
                    <p className="modal-para">You have successfully unsubscribed from Hachion</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
