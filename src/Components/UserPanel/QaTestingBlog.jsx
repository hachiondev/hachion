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
import { Helmet } from "react-helmet-async";

const QaTestingBlog = () => {
  const { category_name } = useParams(); // Get category from URL
  const [blogs, setBlogs] = useState([]); // State for API data
  const [helmetKey, setHelmetKey] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { id } = useParams();

  //  console.log(id);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/blog/${id}`);
        const originalCategory = category_name.replace(/-/g, " ");
        const filteredBlogs = response.data;
        //.filter(
        //   (blog) =>
        //     blog.category_name?.toLowerCase() === originalCategory.toLowerCase()
        // );
        //console.log(filteredBlogs);
        setBlogs(response.data);

        console.log("API Response:", response.data);
        console.log("Is Response an Array?", Array.isArray(response.data));

        setSelectedBlog(filteredBlogs || null); // Set first blog as default
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogs();
  }, [id]);

  // console.log("Blogs Type:", typeof blogs);
  useEffect(() => {
    setHelmetKey((prev) => prev + 1);
  }, [selectedBlog]);

  const handleDownload = () => {
    if (selectedBlog && selectedBlog.blog_pdf) {
      const pdfUrl = `http://localhost:8080/blogs/${selectedBlog.blog_pdf}`;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", selectedBlog.blog_pdf);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No PDF available for this blog.");
    }
  };

  const blogUrl = encodeURIComponent(window.location.href);

  const shareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`;
    window.open(facebookShareUrl, "_blank"); // Opens in a new tab
  };
  const shareOnLinkedIn = () => {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`;
    window.open(linkedInShareUrl, "_blank"); // Opens in a new tab
  };
  const shareOnTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${blogUrl}`;
    window.open(twitterShareUrl, "_blank"); // Opens in a new tab
  };

  return (
    <>
      <Helmet key={helmetKey}>
        <title>{selectedBlog?.meta_title || "Hachion Blogs"}</title>
        <meta
          name="description"
          content={selectedBlog?.meta_description || "Blogs description"}
        />
        <meta
          name="keywords"
          content={selectedBlog?.meta_keyword || "meta keywords"}
        />
        <meta
          property="og:title"
          content={
            selectedBlog?.meta_title || "Best Online IT Certification Courses"
          }
        />
        <meta
          property="og:description"
          content={
            selectedBlog?.meta_description ||
            "Transform your career with Hachion's Online IT Courses."
          }
        />
        <meta
          property="og:image"
          content={
            selectedBlog?.blog_image
              ? `https://api.hachion.co/blogs/${selectedBlog.blog_image}`
              : "https://hachion.co/images/course-banner.jpg"
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content={"article"} />
        <meta name="robots" content="index, follow" />
      </Helmet>

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
              {category_name.replace(/-/g, " ") || "Loading..."}
            </li>
          </ol>
        </nav>
      </div>

      <div className="salesforce-blog">
        <div className="salesforce-blog-left">
          <h3>Recommended Publications</h3>
          {blogs ? (
            <p
              key={blogs.id}
              onClick={() => setSelectedBlog(blogs)}
              style={{
                cursor: "pointer",
                color: selectedBlog?.id === blogs.id ? "#00AEEF" : "black",
                fontWeight: selectedBlog?.id === blogs.id ? "bold" : "normal",
              }}
            >
              {blogs.title}
            </p>
          ) : (
            <p>No blogs available</p>
          )}
        </div>

        <div className="salesforce-blog-right">
          <div className="salesforce-right">
            <button className="btn-curriculum" onClick={handleDownload}>
              <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download
            </button>
            <div className="salesforce-right-icon">
              <p>Share :</p>

              <img
                src={facebook}
                alt="facebook"
                style={{ cursor: "pointer" }}
                onClick={shareOnFacebook}
              />

              <img
                src={twitter}
                alt="twitter"
                style={{ cursor: "pointer" }}
                onClick={shareOnTwitter}
              />
              <img
                src={linkedin}
                alt="linkedin"
                style={{ cursor: "pointer" }}
                onClick={shareOnLinkedIn}
              />
            </div>
          </div>

          {blogs ? (
            <>
              <div className="salesforce-middle">
                <img
                  src={`http://localhost:8080/blogs/${blogs.blog_image}`}
                  alt={blogs.title}
                />
                <div>
                  <h1>{blogs.title}</h1>
                  <div className="salesforce-top">
                    <h5>
                      <FaUserTie className="user-icon" /> {blogs.author}
                    </h5>
                    <h5>{blogs.views || "100"} Views</h5>
                    <h5>
                      {(() => {
                        const d = new Date(blogs.date);
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        const yyyy = d.getFullYear();
                        return `${mm}-${dd}-${yyyy}`;
                      })()}
                    </h5>
                  </div>
                </div>
              </div>

              <div
                className="topics"
                dangerouslySetInnerHTML={{ __html: blogs.description }}
              />
            </>
          ) : (
            <p>No blog selected.</p>
          )}
        </div>
      </div>

      <div className="salesforce-entries">
        <h2 className="salesforce-entries-heading">Recent Entries</h2>
        <RecentEntries />
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default QaTestingBlog;
