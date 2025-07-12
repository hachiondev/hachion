import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
const BlogsSidebar = ({ showMobileFilters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.hachion.co/course-categories/all"
        );
        setCategories(response.data); // assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    console.log("Updated Categories:", updatedCategories); // Debugging output
    onFilterChange([...updatedCategories]); // ✅ Update parent state
  };

  return (
    <>
      <div className={`Blogsidebar ${showMobileFilters ? "show" : "hide"}`}>
        <h4>Categories</h4>

        {categories.map((category) => (
          <div key={category.name} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={category.name}
              checked={selectedCategories.includes(category.name)}
              onChange={() => handleCheckboxChange(category.name)}
            />
            <label htmlFor={category} class="form-check-label">
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogsSidebar;
