import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Blogs.css";
import MoreBlogs from "./MoreBlogs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoWhatsapp, IoMdMail } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
import { BiSearch, BiX } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

import TableOfContents from "./BlogDetailComponents/TableOfContents";
import ReadingProgress from "./BlogDetailComponents/ReadingProgress";
import processBlogContent from "./BlogDetailComponents/processBlogContent";
import MobileShareButton from "./BlogDetailComponents/MobileShareButton";

const BlogDetails = () => {
  const { category_name } = useParams();
  const { title } = useParams();
  const navigate = useNavigate();
  const id = title?.split("-").pop();

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [helmetKey, setHelmetKey] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  // Add this state near the top with your other states
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch single blog for details
  useEffect(() => {
    const fetchSelectedBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.test.hachion.co/blog/${id}`);
        setSelectedBlog(response.data);
      } catch (error) {
        console.error("Error fetching selected blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedBlog();
  }, [id]);

  // ✅ Fetch all blogs for sidebar “Recent Post”
  useEffect(() => {
    const fetchAllBlogs = async () => {
      setRecentLoading(true);
      try {
        const response = await axios.get("https://api.test.hachion.co/blog");
        const mappedBlogs = response.data.map((blog) => ({
          ...blog,
          blog_image: blog.blog_image
            ? `https://api.test.hachion.co/uploads/test/blogs/${blog.blog_image}`
            : Blogimageplaceholder,
        }));
        const sortedBlogs = mappedBlogs.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching all blogs:", error);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchAllBlogs();
  }, []);

  const filteredBlogs = searchQuery.trim()
    ? blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : blogs;

  useEffect(() => {
    setHelmetKey((prev) => prev + 1);
  }, [selectedBlog]);

  // ✅ Parse HTML for headings and inline images (Enhanced)
  useEffect(() => {
    if (selectedBlog?.description) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(selectedBlog.description, "text/html");
      const foundHeadings = [];
      const headingTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

      headingTags.forEach((heading) => {
        const text = heading.textContent.trim();
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        heading.setAttribute("id", id);
        foundHeadings.push({ id, text });
      });

      const imageUrlRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp))/gi;
      doc.body.innerHTML = doc.body.innerHTML.replace(
        imageUrlRegex,
        '<img src="$1" alt="Blog Image" loading="lazy" class="blog-content-image" />'
      );

      setHeadings(foundHeadings);
      setProcessedHtml(doc.body.innerHTML);
    }
  }, [selectedBlog]);

  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  const blogUrl = encodeURIComponent(window.location.href);

  const shareLinks = {
    facebook: () =>
      window.open(`https://www.facebook.com/hachion.co`, "_blank"),
    twitter: () =>
      window.open(`https://x.com/hachion_co`, "_blank"),
    linkedin: () =>
      window.open(`https://www.linkedin.com/company/hachion`, "_blank"),
    whatsapp: () =>
      window.open(`https://whatsapp.com/channel/0029VbBClUlKbYMFEaRnjp28`, "_blank"),
    youtube: () =>
      window.open("https://www.youtube.com/@hachion", "_blank"),
    email: () => {
      const rawBlogUrl = window.location.href;
      const emailSubject = "Check out this blog!";
      const emailBody = `I thought you might like this blog: ${rawBlogUrl}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailUrl, "_blank");
    },
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
          content={selectedBlog?.meta_title || "Best Online IT Certification Courses"}
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
              ? `https://api.test.hachion.co/blogs/${selectedBlog.blog_image}`
              : "https://hachion.co/images/course-banner.jpg"
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content={"article"} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="home-background">
        {/* ✅ NEW: Reading Progress Bar */}
        <ReadingProgress />
        {/* ✅ NEW: Mobile Share Button - Only visible on mobile */}
        <MobileShareButton selectedBlog={selectedBlog} />

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
                {category_name?.replace(/-/g, " ") || "Loading..."}
              </li>
            </ol>
          </nav>
        </div>

        <div className="detail-blog container">
          <div className="detail-blog-right">
            {loading ? (
              <div className="blog-details-skeleton-card large"></div>
            ) : selectedBlog ? (
              <>
                <div className="detail-middle">
                  <img
                    src={`https://api.test.hachion.co/blogs/${selectedBlog.blog_image}`}
                    alt={selectedBlog.title}
                    onError={handleImageError}
                    loading="lazy"
                    className="featured-blog-image"
                  />
                  <div>
                    <div className="detail-top">
                      <div className="detail-top-date">
                        {(() => {
                          const d = new Date(selectedBlog.date);
                          return d.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          });
                        })()}
                      </div>
                    </div>
                    <h1 className="blog-detail-title">{selectedBlog.title}</h1>
                  </div>
                </div>

                {/* ✅ NEW: Estimated Read Time */}
                {processedHtml && (
                  <div className="estimated-read-time">
                    ⏱️ {Math.ceil(processedHtml.split(' ').length / 200)} min read
                    <span className="read-time-separator">•</span>
                    <span className="word-count">{processedHtml.split(' ').length} words</span>
                  </div>
                )}

                {/* ✅ ENHANCED: Modern Table of Contents with active state */}
                {headings.length > 0 && (
                  <TableOfContents headings={headings} />
                )}

                {/* ✅ ENHANCED: Blog content with beautiful formatting */}
                <div
                  className="topics enhanced-blog-content"
                  dangerouslySetInnerHTML={{
                    __html: processBlogContent(processedHtml)
                  }}
                />
              </>
            ) : (
              <div className="blog-not-found">
                <p>Blog post not found</p>
              </div>
            )}

            {/* ✅ ENHANCED: Social Share Sidebar - Kept exactly as is */}
            <div className="detail-right">
              <div className="detail-right-icon">
                <p className="share-label">Share :</p>
                <FaFacebookF
                  className="social-icon facebook"
                  onClick={shareLinks.facebook}
                  style={{ cursor: "pointer" }}
                />
                <FaTwitter
                  className="social-icon twitter"
                  onClick={shareLinks.twitter}
                  style={{ cursor: "pointer" }}
                />
                <FaLinkedinIn
                  className="social-icon linkedin"
                  onClick={shareLinks.linkedin}
                  style={{ cursor: "pointer" }}
                />
                <IoLogoWhatsapp
                  className="social-icon whatsapp"
                  onClick={shareLinks.whatsapp}
                  style={{ cursor: "pointer" }}
                />
                <FaYoutube
                  onClick={shareLinks.youtube}
                  className="social-icon youtube"
                />
                <IoMdMail
                  onClick={shareLinks.email}
                  className="social-icon mail"
                />

              </div>
            </div>
          </div>

          {/* ✅ RECENT POSTS with Skeleton Loader - Kept exactly as is */}
          <div className="detail-blog-left">
            <div className="search-input">
              <div className="search-input-wrapper">
                <BiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search blogs by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <BiX />
                    <span className="clear-tooltip">Clear</span>
                  </button>
                )}
              </div>

              {/* Live dropdown results */}
              {searchQuery.trim() && (
                <div className="search-dropdown">
                  <div className="dropdown-header">
                    <span className="results-count">{filteredBlogs.length} result{filteredBlogs.length !== 1 ? 's' : ''}</span>
                    {filteredBlogs.length > 6 && (
                      <span className="showing-count">
                        Showing {Math.min(filteredBlogs.length, 10)} of {filteredBlogs.length}
                      </span>
                    )}
                  </div>

                  <div className="dropdown-results">
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.slice(0, 10).map((blog, index) => (
                        <div
                          key={blog.id}
                          className="search-dropdown-item"
                          style={{ animationDelay: `${index * 0.03}s` }}
                          onClick={() => {
                            navigate(
                              `/blogs/${blog.category_name
                                .replace(/\s+/g, "-")
                                .toLowerCase()}/${blog.id}`
                            );
                            setSearchQuery("");
                            window.scrollTo(0, 0);
                          }}
                        >
                          <div className="image-wrapper">
                            <img
                              src={blog.blog_image}
                              alt={blog.title}
                              className="search-dropdown-img"
                              onError={(e) => (e.target.src = Blogimageplaceholder)}
                            />
                          </div>
                          <div className="search-dropdown-text">
                            <span className="search-dropdown-category">
                              {blog.category_name}
                            </span>
                            <p className="search-dropdown-title">{blog.title}</p>
                            <span className="read-more-hint">
                              Read <BsArrowRight className="arrow-icon" />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="search-no-results">
                        <BiSearch className="no-results-icon" />
                        <div className="no-results-text">
                          No blogs found for "<strong>{searchQuery}</strong>"
                        </div>
                        <div className="no-results-suggestion">
                          Try different keywords or browse all blogs
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional scroll indicator */}
                  {filteredBlogs.length > 5 && <div className="scroll-indicator" />}
                </div>
              )}
            </div>

            <h3>Recent Post</h3>

            {/* Recent posts now always show from unfiltered blogs */}
            {recentLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div className="recent-post-skeleton" key={i}>
                  <div className="recent-skeleton-image"></div>
                  <div className="recent-skeleton-text subtitle"></div>
                  <div className="recent-skeleton-text title"></div>
                </div>
              ))
              : blogs.length > 0
                ? blogs.slice(0, 5).map((blog) => (
                  <div
                    key={blog.id}
                    className="recent-post-item"
                    onClick={() => {
                      navigate(
                        `/blogs/${blog.category_name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}/${blog.id}`
                      );
                      window.scrollTo(0, 0);
                    }}
                  >
                    <img
                      src={blog.blog_image}
                      alt={blog.title}
                      className="recent-post-img"
                      onError={(e) => (e.target.src = Blogimageplaceholder)}
                      loading="lazy"
                    />
                    <div className="recent-post-text">
                      <div className="recent-post-row">
                        <FaCalendarAlt className="recent-post-date-icon" />
                        <p className="recent-post-date">
                          {(() => {
                            const d = new Date(blog.date);
                            return d.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            });
                          })()}
                        </p>
                      </div>
                      <h5 className="recent-post-title">{blog.title}</h5>
                    </div>
                  </div>
                ))
                : <p className="no-blogs-message">📭 No blogs available</p>}
          </div>
        </div>

        <div className="blog-bottom">
          <MoreBlogs scrollToTop={false} />
        </div>
      </div>
    </>
  );
};

export default BlogDetails;