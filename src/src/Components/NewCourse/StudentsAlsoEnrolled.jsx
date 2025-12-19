import React from "react";
import { useNavigate } from "react-router-dom";
import TrainingEvents from "../UserPanel/TrainingEvents";

export default function StudentsAlsoEnrolled() {
  const navigate = useNavigate();

  return (
    <section className="saewrap">
      <div className="container">

        {/* ✅ CENTER-ALIGNED HEADER (INLINE ONLY) */}
        <div
          className="saehead"
          style={{
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto 24px auto",
          }}
        >
          <h2 style={{ marginBottom: "12px" }}>
            Students Also Enrolled In
          </h2>
          <p style={{ margin: 0 }}>
            Hachion offers flexible, instructor-led online training programs that let you
            learn anytime, anywhere. Our expert instructors, practical curriculum, and
            dedicated support team ensure a rewarding learning journey, helping you
            achieve your professional goals.
          </p>
        </div>

        {/* ✅ TRAINING EVENTS (UNCHANGED) */}
        <TrainingEvents
          limit={4}
          hideHeader={true}
          hideFilters={false}
          hideViewMore={false}   
        />

        {/* ✅ BUTTON ROW (SIDE BY SIDE) */}
        <div
          className="sae-action-row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Explore Courses */}
          {/* <button
            onClick={() => navigate("/coursedetails")}
            className="home-start-button"
          >
            Explore courses
          </button> */}
        </div>

      </div>
    </section>
  );
}
