import React, { useState } from "react";
import Pathfinder1 from "./Pathfinder1";
import Pathfinder2 from "./Pathfinder2";
import Pathfinder3 from "./Pathfinder3";
import Pathfinder4 from "./Pathfinder4";

const UserPathfinder = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    role: "",
    otherRole: "",
    goal: "",
    selectedCourses: [],
    additionalInfo: "",
    preferences: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
    <nav className='dashboard-nav'>
      Pathfinder
      </nav>

    <div>
      {step === 1 && (
        <Pathfinder1
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <Pathfinder2
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <Pathfinder3
          formData={formData}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <Pathfinder4
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
        />
        )}
    </div>
    </div>
  );
};

export default UserPathfinder;