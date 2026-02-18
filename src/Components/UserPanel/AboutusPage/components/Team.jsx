// Team.jsx
import { Avatar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import JobApplicationForm from './JobApplicationForm';

const Team = ({
    activeTab,
    setActiveTab,
    filteredMembers,
    isLoadingTeam,
    teamError,
    getEmployeeImageUrl
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs = ["All", "HR", "SEO", "BUSINESS", "DEVELOPER", "RECRUITMENT"];

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isModalOpen]);

    return (
        <>
            <div className="team-section container">
                {/* Header Section */}
                <div className="home-faq-banner">
                    <h2 className="aboutus-feat-title">Meet our team</h2>
                    <p className="learner-title-tag">
                        A multidisciplinary crew of instructors, product thinkers, and
                        support champions powering your learning journey.
                    </p>
                </div>

                {/* Tab Menu */}
                <div className="tab-menu">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Cards Grid */}
                <div className="team-grid">
                    {isLoadingTeam && <p>Loading team...</p>}
                    {teamError && (
                        <p style={{ color: "red", fontWeight: "bold" }}>{teamError}</p>
                    )}

                    {!isLoadingTeam && !teamError && (
                        <>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => {
                                    const imgSrc = getEmployeeImageUrl(member.companyImage);

                                    return (
                                        <div
                                            key={member.employeeId ?? member.id}
                                            className="team-card"
                                        >
                                            <div
                                                className="team-image"
                                                style={{
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    borderRadius: "8px",
                                                }}
                                            >
                                                {/* Default Avatar (always visible) */}
                                                <Avatar
                                                    variant="square"
                                                    sx={{ width: "100%", height: "100%" }}
                                                />

                                                {/* Actual image, overlays Avatar */}
                                                {imgSrc && (
                                                    <img
                                                        src={imgSrc}
                                                        alt={member.name}
                                                        style={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <h3 className="team-name">{member.name}</h3>
                                            <p className="team-role">{member.role}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    style={{
                                        gridColumn: "1 / -1",
                                        textAlign: "center",
                                        color: "#777",
                                        fontSize: "18px",
                                        fontWeight: "500",
                                        padding: "40px 0",
                                    }}
                                >
                                    No Employees found for this department.
                                </div>
                            )}
                        </>
                    )}

                    {/* Join Team Card - Added onClick to open modal */}
                    <div className="team-card join-card" onClick={openModal} style={{ cursor: 'pointer' }}>
                        <div className="join-content">
                            <p className="join-title">Interested to join our team?</p>
                            <span className="apply-link"> {/* Changed from a to span since it's not a link anymore */}
                                Apply now →
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Popup - Ultra Compact */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        padding: '5px'
                    }}
                    onClick={handleOverlayClick}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            width: '100%',
                            maxWidth: '650px',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                background: 'linear-gradient(135deg, #00AEEF 0%, #0088cc 100%)',
                                color: 'white'
                            }}
                        >
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Apply Now</h2>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    padding: '0 8px',
                                    color: 'white',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{
                            padding: 0,
                            overflow: 'auto',
                            maxHeight: 'calc(90vh - 40px)'
                        }}>
                            <JobApplicationForm />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Team;