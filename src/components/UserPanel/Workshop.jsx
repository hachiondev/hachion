"use client";

import { useState, useEffect, useMemo } from "react";
import WorkshopCard from "./WorkshopCard";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Corporate.css";
import { useWorkshops } from "@/Api/hooks/WorkshopApi/useWorkshops";
import { slugifyWorkshopTitle } from "@/lib/workshopSlug";
import { API_BASE_URL } from "@/lib/apiBase";

const EMPTY_ARRAY = [];

const Workshop = () => {
  const router = useRouter();
  const { data: workshops = EMPTY_ARRAY } = useWorkshops();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = useMemo(() => Array.from(new Set(workshops.map((w) => w.category_name).filter(Boolean))), [workshops]);
  const courseCategory = useMemo(() => Array.from(new Set(workshops.map((w) => w.course_name).filter(Boolean))), [workshops]);

  const filteredWorkshops = useMemo(() => {
    let filtered = [...workshops];
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((w) => selectedCategories.includes(w.category_name));
    }
    if (selectedCourses.length > 0) {
      filtered = filtered.filter((w) => selectedCourses.includes(w.course_name));
    }
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return filtered;
  }, [selectedCategories, selectedCourses, sortOrder, workshops]);

  const handleCheckboxChange = (value, type) => {
    if (type === "category") {
      setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
    } else if (type === "course") {
      setSelectedCourses((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
    }
  };

  return (
    <div className="home-background">
      <div>
        <h1 className="course-banner-content">Workshop</h1>
      </div>
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Workshop
            </li>
          </ol>
        </nav>
      </div>

      <div className="mobile-filter-toggle">
        <button className="clear-button" onClick={() => setShowMobileFilters(!showMobileFilters)}>
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <div className="workshop-page">
        <aside className={`workshop-sidebar ${showMobileFilters ? "show" : "hide"}`}>
          <h4>Filter</h4>
          <p className="workshop-note">Select either Category or Course filter not both.</p>
          <h6>Category</h6>
          {category.map((cat, index) => (
            <label key={index} style={{ display: "block", marginBottom: "6px", marginLeft: "8px" }}>
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCheckboxChange(cat, "category")} style={{ marginRight: "8px" }} />
              {cat}
            </label>
          ))}

          <h6>Course</h6>
          {courseCategory.map((course, index) => (
            <label key={index} style={{ display: "block", marginBottom: "6px", marginLeft: "8px" }}>
              <input type="checkbox" checked={selectedCourses.includes(course)} onChange={() => handleCheckboxChange(course, "course")} style={{ marginRight: "8px" }} />
              {course}
            </label>
          ))}

          <h6 style={{ whiteSpace: "nowrap" }}>Sort by Date</h6>
          <div className="filter-workshop">
            <div>
              <label>
                <input type="radio" name="sort" style={{ marginRight: "8px" }} checked={sortOrder === "newest"} onChange={() => setSortOrder("newest")} />
                Newest
              </label>
            </div>
            <div>
              <label>
                <input type="radio" name="sort" style={{ marginRight: "8px" }} checked={sortOrder === "oldest"} onChange={() => setSortOrder("oldest")} />
                Oldest
              </label>
            </div>
          </div>
          <div className="clear-align">
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedCourses([]);
                setSortOrder("newest");
              }}
              className="clear-button"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <div className="workshop-container">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop) => {
              const slug = slugifyWorkshopTitle(workshop.title);
              return (
                <WorkshopCard
                  key={workshop.id}
                  banner_image={`${API_BASE_URL}/${workshop.banner_image}`}
                  title={workshop.title}
                  date={(() => {
                    if (!workshop?.date) return "Loading...";
                    const d = new Date(workshop.date);
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const dd = String(d.getDate()).padStart(2, "0");
                    const yyyy = d.getFullYear();
                    return `${mm}-${dd}-${yyyy}`;
                  })()}
                  time={workshop.time}
                  timeZone={workshop.time_zone}
                  onClick={() => router.push(`/workshop/${slug}`)}
                />
              );
            })
          ) : (
            <p>No workshops found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workshop;
