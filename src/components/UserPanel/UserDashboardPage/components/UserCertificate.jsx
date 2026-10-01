"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import enroll from "@/assets/dash-icon1.webp";
import learn from "@/assets/dash-icon2.webp";
import cert from "@/assets/dash-icon3.webp";
import { TbShare3 } from "react-icons/tb";
import "../../Dashboard.css";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's UserDashboardPage/components/UserCertificate.jsx.
export default function UserCertificate() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [userName, setUserName] = useState("");
  const [availabilityById, setAvailabilityById] = useState({});
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData") || "null") || {};
    const userEmail = userData.email || "";
    if (!userEmail) {
      setErr("No email found in localStorage (loginuserData.email).");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/myprofile?email=${encodeURIComponent(userEmail)}`);
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

  // Real download/view endpoints (CertificateController.java) - these set
  // Content-Disposition to `${studentId}_Certificate.pdf` server-side, so
  // the filename a user actually saves always matches the required format.
  // Previously this guessed a static `/uploads/prod prodprod...` file path by
  // reconstructing the on-disk filename client-side, which could diverge
  // from the backend's own sanitization and produced the wrong download
  // filename (it included the course name).
  const getCertificateViewURL = (certificateId) => {
    if (!certificateId) return "#";
    return `${API_BASE_URL}/certificate/downloadForView/${certificateId}`;
  };
  const getCertificateDownloadURL = (certificateId) => {
    if (!certificateId) return "#";
    return `${API_BASE_URL}/certificate/download/${certificateId}`;
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
      try {
        const userData = JSON.parse(localStorage.getItem("loginuserData") || "null") || {};
        const userEmail = userData.email || "";
        const res = await fetch(`${API_BASE_URL}/certificate/getByEmail?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) throw new Error(`Certificates fetch failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setCertificates(data.items || []);
          const entries = await Promise.all(
            (data.items || []).map(async (c) => {
              const status = await checkCertificateExists(getCertificateViewURL(c.id));
              return [c.id, status];
            })
          );
          const map = {};
          entries.forEach(([id, status]) => (map[id] = status));
          setAvailabilityById(map);
        }
      } catch (e) {
        console.error("Error fetching certificates:", e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const stats = {
    total: certificates.length || 0,
    averageGrade: certificates.length ? certificates[0].grade || "-" : "-",
    latestMonth: certificates.length
      ? new Date(certificates[0].issueDate).toLocaleString("en-US", { month: "long", year: "numeric" })
      : "-",
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
        <nav className="dashboard-nav">Certificate of Completion {userName ? `— ${userName}` : ""}</nav>
      </div>

      <div className="certificate-content-cards">
        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">{stats.total.toString().padStart(2, "0")}</div>
            <Image src={enroll} alt="Total Certificate" />
          </div>
          <div className="cert-label">Total Certificates</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">{stats.averageGrade}</div>
            <Image src={learn} alt="Average Grade" />
          </div>
          <div className="cert-label">Average Grade</div>
        </div>

        <div className="cert-card">
          <div className="dashboard-card-row">
            <div className="cert-value">{stats.latestMonth}</div>
            <Image src={cert} alt="Certificate" />
          </div>
          <div className="cert-label">Latest Certificate</div>
        </div>
      </div>

      <div className="wishlist-container">
        {certificates.length > 0 ? (
          <div className="wishlist-grid">
            {certificates.map((certItem) => {
              const availability = availabilityById[certItem.id] || (studentId ? "unknown" : "no");
              const isDisabled = !studentId || availability === "no";
              const btnLabel = availability === "no" ? "Not available yet" : "Download Certificate";
              return (
                <div key={certItem.id} className="certificate-card">
                  <div className="card-header-div" style={{ position: "relative" }}>
                    <div
                      className="card-image"
                      style={{
                        width: "100%",
                        height: "200px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {!studentId ? (
                        <p>No Student ID</p>
                      ) : availability === "checking" ? (
                        <p>Checking…</p>
                      ) : availability === "no" ? (
                        <p>Not issued yet</p>
                      ) : availability === "yes" ? (
                        <iframe
                          src={`${getCertificateViewURL(certItem.id)}#toolbar=0`}
                          title={`Certificate Preview for ${certItem.courseName}`}
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                        ></iframe>
                      ) : (
                        <p>Loading…</p>
                      )}
                    </div>

                    <div
                      className="card-action-icons"
                      style={{ position: "absolute", top: 0, right: 0, zIndex: 5, display: "flex", gap: 8, pointerEvents: "auto" }}
                    >
                      <button type="button" className="card-icon-share" aria-label="Share this Blog" title="Share">
                        <TbShare3 />
                      </button>
                    </div>
                  </div>

                  <div className="card-course-details">
                    <h3 className="grade">Grade {certItem.grade}</h3>
                    <p className="cert-details">
                      Issue Date <span>{certItem.issueDate}</span>
                    </p>
                    <p className="cert-details">
                      Certificate ID <span>{certItem.certificateNumber}</span>
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
                        window.open(getCertificateDownloadURL(certItem.id), "_blank");
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
