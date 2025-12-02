// src/Components/Navbar/components/SearchResults.jsx
import React, { useCallback } from "react";

const API_BASE = "https://api.test.hachion.co";
const resolveImageUrl = (img) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
};

export default function SearchResults({ items = [], onSelect }) {
  const handleClick = useCallback((item) => onSelect(item), [onSelect]);

  if (!items || items.length === 0) return null;

  return (
    <div className="search-results position-absolute bg-white shadow rounded w-100 mt-1">
      {items.map(item => (
        <div key={item._id || item.id || (item.courseName || item.title)} className="p-2 border-bottom text-dark d-flex align-items-center" onClick={() => handleClick(item)} style={{ cursor: "pointer" }}>
          <img src={resolveImageUrl(item.courseImage)} alt="" style={{ width: 40, height: 40, marginRight: 8 }} loading="lazy" />
          <div>
            <div style={{ fontWeight: 600 }}>{item.courseName || item.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{item.category_name || ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
