// ManageCategories.js (Parent Component)
import React, { useState } from 'react';
import CourseCategory from './CourseCategory';
import AddCourseCategory from './AddCourseCategory';
import CategoryTable from './CategoryTable';

const ManageCategories = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };



  return (
    <div>
      {showAddCategory ? (
        <AddCourseCategory  />
       
      ) : (<>
        <CourseCategory onAddCategoryClick={handleAddCategoryClick} />
 <CategoryTable/>
        </>
      )}
    </div>
  );
};

export default ManageCategories;
