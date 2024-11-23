import React, { useState } from 'react';
import Course from './Course';
import AddCourseDetails from './AddCourseDetails';

const ManageCourse = () => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  return (
    <div>
      {isAddingCourse ? (
        <AddCourseDetails onBack={() => setIsAddingCourse(false)} />
      ) : (
        <Course onAddCourse={() => setIsAddingCourse(true)} />
      )}
    </div>
  );
};

export default ManageCourse;