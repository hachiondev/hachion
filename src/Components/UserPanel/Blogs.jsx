import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import BlogList from "./BlogList";
import BlogsSidebar from "./BlogsSidebar";
import LatestArticles from "./LatestArticles";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import "./Course.css"; // ✅ Use same styles as course page
import "./Bloglist.css";
import WatchVideos from "./WatchVideos";

const Blogs = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Hachion's Blog | Online learning news, trends & insights</title>
        <meta
          name="description"
          content="Get the latest from Hachion, a global online learning platform offering world-class learning experiences to transform lives worldwide."
        />
        <meta
          name="keywords"
          content="IT training, Software Courses, Blogs, Technology, Latest insights"
        />
        <meta
          property="og:title"
          content="Online IT Training: Get Certified, Find Your Dream Job"
        />
        <meta
          property="og:description"
          content="Learn online with the best courses at Hachion."
        />
        <meta property="og:image" content="/Hachion-logo.png" />
        <link rel="canonical" href="https://hachion.co/blogs" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hachion",
            "url": "https://www.hachion.co",
            "logo": "https://www.hachion.co/Hachion-logo.png",
            "sameAs": [
              "https://www.facebook.com/hachion.co",
              "https://x.com/hachion_co",
              "https://www.linkedin.com/company/hachion",
              "https://www.instagram.com/hachion_trainings",
              "https://www.quora.com/profile/Hachion-4",
              "https://www.youtube.com/@hachion"
            ]
          }
        `}
        </script>
      </Helmet>

      <Topbar />
      <NavbarTop />

        {/* ✅ Right Section - Blog Cards */}
        <div className="sidebar-right-container container">
          <div className="trending-data">
            <h1 className="trending-title">Hachion Tech Blog</h1>
            <p className="learner-title-tag text-center mb-4">
              Discover our useful resources and read Blogs on different categories
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
          <BlogsSidebar
            onFilterChange={setSelectedCategories}
          />
          <div className="sidebar-right-container">
          <BlogList selectedCategories={selectedCategories} />
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
