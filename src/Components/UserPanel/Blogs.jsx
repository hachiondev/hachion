import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import BlogList from "./BlogList";
import BlogsSidebar from "./BlogsSidebar";
import LatestArticles from "./LatestArticles";
import WatchVideos from "./WatchVideos";
import Pagination from "./Pagination";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import "./Course.css";
import "./Bloglist.css";

const Blogs = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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
      window.scrollTo(0, 400);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hachion's Blog | Online learning news, trends & insights</title>
        <meta
          name="description"
          content="Get the latest from Hachion, a global online learning platform offering world-class learning experiences to transform lives worldwide."
        />
        <link rel="canonical" href="https://hachion.co/blogs" />
      </Helmet>

      <Topbar />
      <NavbarTop />

      <div className="sidebar-right-container container">
        <div className="trending-data" ref={bannerRef}>
          <h1 className="trending-title">Hachion Tech Blog</h1>
          <p className="learner-title-tag text-center mb-4">
            Discover useful resources and insights across tech categories
          </p>
        </div>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>

        <div className="course-content container">
          <BlogsSidebar onFilterChange={setSelectedCategories} />

          <div className="sidebar-right-container">
            <BlogList
              selectedCategories={selectedCategories}
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

      <LatestArticles />
      <WatchVideos />
      <Footer />
      <StickyBar />
    </>
  );
};

export default Blogs;
