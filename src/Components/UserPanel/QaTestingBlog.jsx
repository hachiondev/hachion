import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import "./Blogs.css";
import facebook from "../../Assets/facebook.png";
import twitter from "../../Assets/twitter.png";
import linkedin from "../../Assets/linkedin.png";
import { FaUserTie } from "react-icons/fa6";
import RecentEntries from "./RecentEntries";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { MdKeyboardArrowRight } from "react-icons/md";
import automation from "../../Assets/automationtesting.png";

const QaTestingBlog = () => {
  const { category_name } = useParams(); // Get category from URL
  const [blogs, setBlogs] = useState([]); // State for API data

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/blog");
        const filteredBlogs = response.data.filter(
          (blog) => blog.category_name === category_name
        );
        setBlogs(filteredBlogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogs();
  }, [category_name]); // Re-fetch when category changes

  const handleDownload = () => {
    if (blogs.length > 0 && blogs[0].blog_pdf) {
      const pdfUrl = `https://api.hachion.co/blogs/${blogs[0].blog_pdf}`;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", blogs[0].blog_pdf); // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No PDF available for this category.");
    }
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <a href="/blogs">Blog</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {category_name || "Loading..."}
            </li>
          </ol>
        </nav>
      </div>

      <div className="salesforce-blog">
        <div className="salesforce-blog-left">
          <h3>Recommended Publications</h3>
          <p>Salesforce admin interview FAQ's</p>
          <p>Salesforce Developer interview FAQ's</p>
        </div>

        <div className="salesforce-blog-right">
          <div className="salesforce-right">
            <button className="btn-curriculum" onClick={handleDownload}>
              <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download
            </button>
            <div className="salesforce-right-icon">
              <p>Share :</p>
              <img src={facebook} alt="facebook" />
              <img src={twitter} alt="twitter" />
              <img src={linkedin} alt="linkedin" />
            </div>
          </div>

          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="salesforce-middle">
                <img
                  src={`https://api.hachion.co/blogs/${blog.blog_image}`}
                  alt={blog.title}
                />
                <div>
                  <h1>{blog.title}</h1>
                  <div className="salesforce-top">
                    <h5>
                      <FaUserTie className="user-icon" /> {blog.author}
                    </h5>
                    <h5>{blog.views || "100"} Views</h5>
                    <h5>{blog.date}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found for this category.</p>
          )}

          <div className="topics">
            {blogs.length > 0 ? blogs[0].description : "Loading description..."}
          </div>
        </div>
      </div>

      <div className="salesforce-entries">
        <h1 className="salesforce-entries-heading">Recent Entries</h1>
        <RecentEntries />
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default QaTestingBlog;
