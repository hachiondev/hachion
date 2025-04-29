import React, { useState } from "react";
import "./Admin.css";
import CourseCertificate from "./CourseCertificate";
import CandidateCertificate from "./CandidateCertificate";
export default function Certificate() {
  const [activeTab, setActiveTab] = useState("courseCertificate");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <h3>Certificates</h3>
      <div className="certificate-tabs">
        <div
          className={`tab-item ${
            activeTab === "courseCertificate" ? "active-tab" : ""
          }`}
          onClick={() => handleTabChange("courseCertificate")}
        >
          Course Certificate
        </div>
        <div
          className={`tab-item ${
            activeTab === "candidateCertificate" ? "active-tab" : ""
          }`}
          onClick={() => handleTabChange("candidateCertificate")}
        >
          Candidate Certificate
        </div>
      </div>
      {activeTab === "courseCertificate" && <CourseCertificate />}
      {activeTab === "candidateCertificate" && <CandidateCertificate />}
    </>
  );
}
