import React, { useState } from 'react';
import AddCourseDetails from './AddCourseDetails';
import CourseDetail from './CourseDetail';

const ManageCourse = () => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  return (
    <div>
      {isAddingCourse ? (
        <AddCourseDetails onBack={() => setIsAddingCourse(false)} />
      ) : (
        <CourseDetail onAddCourse={() => setIsAddingCourse(true)} />
      )}
    </div>
  );
};

export default ManageCourse;