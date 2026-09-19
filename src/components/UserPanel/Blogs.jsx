"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BlogList from "./BlogList";
import BlogsSidebar from "./BlogsSidebar";
import LatestArticles from "./LatestArticles";
import WatchVideos from "./WatchVideos";
import Pagination from "./Common/Pagination";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./CoursePage/Course.css";
import "./Bloglist.css";

// useSearchParams() opts this subtree out of static rendering unless it's
// wrapped in its own Suspense boundary — split out so the rest of the page
// isn't forced into a loading state while the boundary resolves (which is
// effectively instant on the client).
function CategoryFilterNav({ onCategoryFromUrl }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  useEffect(() => {
    if (categoryFromUrl) onCategoryFromUrl(categoryFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl]);
  return null;
}

const Blogs = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  // Every known blog category, reported once by BlogsSidebar after its own
  // /blog/categories fetch resolves. BlogList uses this (instead of making
  // its own duplicate /blog/categories request) to show every blog by
  // default when the visitor hasn't clicked a category filter yet.
  const [allCategories, setAllCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCardsPerPage(4);
      } else if (width <= 1024) {
        setCardsPerPage(4);
      } else {
        setCardsPerPage(6);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (bannerRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <CategoryFilterNav onCategoryFromUrl={(cat) => setSelectedCategories([cat])} />
      </Suspense>

      <div className="blogs-header">
        <nav aria-label="breadcrumb ">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>
        </div>

      <div className="sidebar-right-container container">
        <div className="trending-data" ref={bannerRef}>
          <h1 className="trending-title">Hachion Tech Blog</h1>
          <p className="learner-title-tag text-center mb-4">
            Discover useful resources and insights across tech categories
          </p>

        <div className="course-content container">
          <BlogsSidebar onFilterChange={setSelectedCategories} onCategoriesLoaded={setAllCategories} />

          <div className="sidebar-right-container">
            <BlogList
              selectedCategories={selectedCategories}
              allCategories={allCategories}
              currentPage={currentPage}
              cardsPerPage={cardsPerPage}
              onTotalBlogsChange={setTotalBlogs}
            />

            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalCards={totalBlogs}
                cardsPerPage={cardsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      </div>

      <LatestArticles />
      <WatchVideos />
    </>
  );
};

export default Blogs;
