import React, { useState, useEffect } from "react";
import enroll from "../../Assets/dash-icon1.png";
import learn from "../../Assets/dash-icon2.png";
import cert from "../../Assets/dash-icon3.png";
import "./Dashboard.css";

export default function UserCertificate() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [userName, setUserName] = useState("");
  const [availabilityById, setAvailabilityById] = useState({});

  const [certificates] = useState([
    {
      id: 1,
      courseName: "QA Manual Testing",
      instructor: "John Smith",
      grade: "A+",
      issueDate: "March 10, 2024",
      certificateId: "CERT-2024-QA-001",
    },
    {
      id: 2,
      courseName: "Python Programming",
      instructor: "Sarah Johnson",
      grade: "A",
      issueDate: "March 5, 2024",
      certificateId: "CERT-2024-PY-002",
    },
    {
      id: 3,
      courseName: "React Frontend Development",
      instructor: "Michael Lee",
      grade: "A+",
      issueDate: "Feb 22, 2024",
      certificateId: "CERT-2024-RE-003",
    },
  ]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";
    if (!userEmail) {
      setErr("No email found in localStorage (loginuserData.email).");
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        const res = await fetch(
          `https://api.test.hachion.co/api/v1/user/myprofile?email=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
        const data = await res.json();
        if (!data.studentId) throw new Error("studentId missing in profile response");
        setStudentId(data.studentId);
        if (data.name) setUserName(data.name);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buildCertificateFileName = (studentId, courseName) => {
    const sanitized = courseName
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "_")
      .replace(/^_+|_+$/g, "");
    return `${studentId}_${sanitized}_Certificate.pdf`;
  };

  const getCertificateURL = (studentId, courseName) => {
    if (!studentId) return "#";
    const fileName = buildCertificateFileName(studentId, courseName);
    return `https://api.test.hachion.co/uploads/prod/certificates/${fileName}`;
  };

  const checkCertificateExists = async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD", mode: "cors" });
      return res.ok ? "yes" : "no";
    } catch {
      return "unknown";
    }
  };

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        certificates.map(async (c) => {
          const url = getCertificateURL(studentId, c.courseName);
          const status = await checkCertificateExists(url);
          return [c.id, status];
        })
      );
      if (!cancelled) {
        const map = {};
        entries.forEach(([id, status]) => (map[id] = status));
        setAvailabilityById(map);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId, certificates]);

  const stats = {
    total: certificates.length,
    averageGrade: "4.2 (A+)",
    latestMonth: "March 2024",
  };

  if (loading) {
    return (
      <>
        <div className="courses-enrolled">
          <nav className="dashboard-nav">Certificate of Completion</nav>
        </div>
        <p className="wishlist-empty">Loading your profile…</p>
      </>
    );
  }

  if (err) {
    return (
      <>
        <div className="courses-enrolled">
          <nav className="dashboard-nav">Certificate of Completion</nav>
        </div>
        <p className="wishlist-empty">Unable to load profile: {err}</p>
      </>
    );
  }

  return (
    <>
      <div className="courses-enrolled">
        <nav className="dashboard-nav">
          Certificate of Completion {userName ? `— ${userName}` : ""}
        </nav>
      </div>

      <div className="certificate-content-cards">
        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">
              {stats.total.toString().padStart(2, "0")}
            </div>
            <img src={enroll} alt="Total Certificate" />
          </div>
          <div className="cert-label">Total Certificates</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">{stats.averageGrade}</div>
            <img src={learn} alt="Average Grade" />
          </div>
          <div className="cert-label">Average Grade</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">{stats.latestMonth}</div>
            <img src={cert} alt="Certificate" />
          </div>
          <div className="cert-label">Latest Certificate</div>
        </div>
      </div>

      <div className="wishlist-container">
        {certificates.length > 0 ? (
          <div className="wishlist-grid">
            {certificates.map((certItem) => {
              const availability =
                availabilityById[certItem.id] || (studentId ? "unknown" : "no");
              const isDisabled = !studentId || availability === "no";
              const btnLabel =
                availability === "no" ? "Not available yet" : "Download Certificate";

              return (
                <div key={certItem.id} className="certificate-card">
                  <div className="card-header-div">
                    <div
                      className="card-image"
                      style={{
                        width: "100%",
                        height: "200px",
                        border: "1px dashed #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      {!studentId
                        ? "No Student ID"
                        : availability === "yes"
                        ? "PDF ready"
                        : availability === "no"
                        ? "Not issued yet"
                        : "Checking…"}
                    </div>
                  </div>

                  <div className="card-course-details">
                    <div className="card-row">
                      <p className="trainer-name">Instructor</p>
                      <p className="trainer-name">{certItem.instructor}</p>
                    </div>
                    <h3 className="grade">Grade {certItem.grade}</h3>
                    <p className="cert-details">
                      Issue Date <span>{certItem.issueDate}</span>
                    </p>
                    <p className="cert-details">
                      Certificate ID <span>{certItem.certificateId}</span>
                    </p>

                    <button
                      className="card-view-btn"
                      disabled={isDisabled}
                      aria-disabled={isDisabled}
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                          return;
                        }
                        window.open(
                          getCertificateURL(studentId, certItem.courseName),
                          "_blank"
                        );
                      }}
                      title={
                        !studentId
                          ? "Student ID not loaded"
                          : availability === "no"
                          ? "Certificate not issued yet"
                          : "Download / View Certificate"
                      }
                    >
                      {btnLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="wishlist-empty">No certificates found.</p>
        )}
      </div>
    </>
  );
}
