import React, { useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";

const PopupInterest1 = ({ formData, onChange, onNext, onSkip }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [courses, setCourses] = useState([]);
    useEffect(() => {
    axios
      .get("https://api.test.hachion.co/courses/all")
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setErrorMessage("Failed to load courses. Please try again.");
      });
  }, []);

  const courseOptions = courses.map((course) => ({
    value: course.courseName,
    label: course.courseName,
  }));

  const handleCourseChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    onChange("interests", selectedValues);
  };
  return (
    <div className="have-modal-overlay">
      <div className="interest-modal-content">
        <div className="popup-interest">
            <div className="pathfinder-header">
      <p>Basic Background & Goals</p>
      </div>
        <form className="pathfinder-form">
      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">
            1. What is your current role or background?</label>
        <select
          className="form-control-pathfinder"
        id="pathfinder"
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
            id="pathfinder"
            placeholder="Please specify"
            value={formData.otherRole}
            onChange={(e) => onChange("otherRole", e.target.value)}
          />
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="pathfinder" className="Pathfinder-label">2. What is your primary goal for joining Hachion?</label>
        <select
          className="form-control-pathfinder"
            id="pathfinder"
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
                    <label htmlFor="pathfinder" className="Pathfinder-label">
                      3. What are your areas of interest? (Select all that apply)
                    </label>
                    <Select
                      className="form-control-pathfinder"
                      id="pathfinder1"
                      options={courseOptions}
                      isMulti
                      onChange={handleCourseChange}
                      value={courseOptions.filter((opt) => formData.interests.includes(opt.value))}
                      placeholder="Search or select courses..."
                  />
                    <div
                      className="border rounded p-2 mt-2"
                      style={{ maxHeight: "140px", overflowY: "auto" }}
                    >
                      {formData.interests.map((courseName, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked
                            readOnly
                          />
                          <label className="form-check-label">{courseName}</label>
                        </div>
                      ))}
                    </div>
                  </div>

        <div class="form-group row">
        <div class="col-auto">
        <button class="edit-path-button" type="button" onClick={onSkip}>Skip Now</button>
        </div>
        <div class="col-auto">
        <button class="path-button" type="button" onClick={onNext}>Next</button>
      </div>
      </div>
      </form>
      </div>
    </div>
    </div>
  );
};

export default PopupInterest1;
