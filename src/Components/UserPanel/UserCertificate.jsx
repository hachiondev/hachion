import React, { useState, useEffect } from "react";
import samplecertificate from "../../Assets/newcertificate.png";
import enroll from "../../Assets/dash-icon1.png";
import learn from "../../Assets/dash-icon2.png";
import cert from "../../Assets/dash-icon3.png";
import "./Dashboard.css";

export default function UserCertificate() {
  // --- Static mock data ---
  const [certificates] = useState([
    {
      id: 1,
      courseName: "Full Stack Web Development",
      instructor: "John Smith",
      grade: "A+",
      issueDate: "March 10, 2024",
      certificateId: "CERT-2024-FS-001",
      image: samplecertificate,
    },
    {
      id: 2,
      courseName: "Data Science with Python",
      instructor: "Sarah Johnson",
      grade: "A",
      issueDate: "March 5, 2024",
      certificateId: "CERT-2024-DS-002",
      image: samplecertificate,
    },
    {
      id: 3,
      courseName: "React Frontend Development",
      instructor: "Michael Lee",
      grade: "A+",
      issueDate: "Feb 22, 2024",
      certificateId: "CERT-2024-RE-003",
      image: samplecertificate,
    },
  ]);

  // --- Static top stats ---
  const stats = {
    total: certificates.length,
    averageGrade: "4.2 (A+)",
    latestMonth: "March 2024",
  };

  return (
    <>
      {/* Header */}
      <div className="courses-enrolled">
        <nav className="dashboard-nav">Certificate of Completion</nav>
      </div>

      {/* Summary Section */}
      <div className="certificate-content-cards">
        <div className="cert-card">
          <div className="dashboard-card-row">
          <div className="cert-value">
            {stats.total.toString().padStart(2, "0")}
          </div>
          <img src={enroll} alt='Total Certificate' />
          </div>
          <div className="cert-label">Total Certificates</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
          <div className="cert-value">{stats.averageGrade}</div>
          <img src={learn} alt='Average Grade' />
          </div>
          <div className="cert-label">Average Grade</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
          <div className="cert-value">{stats.latestMonth}</div>
          <img src={cert} alt='Certificate' />
          </div>
          <div className="cert-label">Latest Certificate</div>
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="wishlist-container">
        {certificates.length > 0 ? (
          <div className="wishlist-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certificate-card">
                <div className="card-header-div">
                  <img
                    src={cert.image}
                    alt="Certificate"
                    className="card-image"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x200?text=Certificate")
                    }
                  />
                </div>

                <div className="card-course-details">

                  <div className="card-row">
                  <p className="trainer-name">
                    Instructor
                  </p>
                  <p className="trainer-name">
                    {cert.instructor}
                  </p>
                  </div>
                  <h3 className="grade">Grade {cert.grade}</h3>
                  <p className="cert-details">
                    Issue Date <span>{cert.issueDate}</span>
                  </p>
                  <p className="cert-details">
                    Certificate ID <span>{cert.certificateId}</span>
                  </p>

                  <button className="card-view-btn">
                     Download Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="wishlist-empty">No certificates found.</p>
        )}
      </div>
    </>
  );
}
