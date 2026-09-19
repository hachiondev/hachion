"use client";

import { useState } from "react";
import Select from "react-select";
import { useCourses } from "@/Api/hooks/HomePageApi/NavbarApi/useCourses";
import "./PopupInterest.css";

// Ported from the CRA app's src/Components/UserPanel/Pathfinder1.jsx (the
// dashboard's "Pathfinder" tab, step 1 of 4 — same survey as
// PopupInterest1 but shown inline on the dashboard instead of as a
// post-registration modal, and pre-filled/editable). Reuses useCourses()
// instead of a fresh inline axios call.
const Pathfinder1 = ({ formData, onChange, onNext, onEdit }) => {
  const { data: courses = [] } = useCourses();
  const [isEditing, setIsEditing] = useState(false);
  const courseOptions = courses.map((course) => ({ value: course.courseName, label: course.courseName }));

  const handleCourseChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    onChange("selectedCourses", selectedValues);
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
    if (typeof onEdit === "function") onEdit();
  };

  const isFormFilled =
    formData.role &&
    formData.goal &&
    (formData.selectedCourses || []).length > 0 &&
    (formData.role !== "Other" || formData.otherRole.trim() !== "");

  return (
    <div className="resume-div">
      <div className="popup-interest">
        <div className="pathfinder-header">
          <p>Basic Background &amp; Goals</p>
        </div>
        <form className="pathfinder-form">
          <div className="mb-3">
            <label htmlFor="pathfinderRole" className="Pathfinder-label">
              1. What is your current role or background?
            </label>
            <select
              className="form-control-pathfinder"
              id="pathfinderRole"
              value={formData.role}
              onChange={(e) => onChange("role", e.target.value)}
            >
              <option value="">-- Select your role --</option>
              <option value="School Student">School Student</option>
              <option value="College Student">College Student</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Career Switcher">Career Switcher</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Other">Other</option>
            </select>

            {formData.role === "Other" && (
              <input
                type="text"
                className="form-control-pathfinder"
                id="pathfinderRoleOther"
                placeholder="Please specify"
                value={formData.otherRole}
                onChange={(e) => onChange("otherRole", e.target.value)}
              />
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="pathfinderGoal" className="Pathfinder-label">
              2. What is your primary goal for joining Hachion?
            </label>
            <select
              className="form-control-pathfinder"
              id="pathfinderGoal"
              value={formData.goal}
              onChange={(e) => onChange("goal", e.target.value)}
            >
              <option value="">-- Select your goal --</option>
              <option value="Get a job in tech">Get a job in tech</option>
              <option value="Switch career domain">Switch career domain</option>
              <option value="Learn new skills for current job">Learn new skills for current job</option>
              <option value="Work on freelance/side projects">Work on freelance/side projects</option>
              <option value="Just exploring options">Just exploring options</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="pathfinderCourses" className="Pathfinder-label">
              3. What are your areas of interest? (Select all that apply)
            </label>
            <Select
              inputId="pathfinderCourses"
              className="form-control-pathfinder"
              classNamePrefix="pathfinder-select"
              options={courseOptions}
              isMulti
              value={(formData.selectedCourses || []).map((course) => ({ value: course, label: course }))}
              onChange={handleCourseChange}
              placeholder="Search or select courses..."
            />
            <div className="pathfinder-interest-box">
              {(formData.selectedCourses || []).map((courseName, index) => (
                <div className="pathfinder-interest-chip" key={index}>
                  <input className="form-check-input" type="checkbox" checked readOnly />
                  <label className="Pathfinder-form-check-label">{courseName}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="pathfinder-button-row">
            <button className="edit-path-button" type="button" onClick={handleEditClick}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button className="path-button" type="button" onClick={onNext} disabled={!isFormFilled}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pathfinder1;
