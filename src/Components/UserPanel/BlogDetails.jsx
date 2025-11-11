import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import "./Blogs.css";
import facebook from "../../Assets/facebook.png";
import twitter from "../../Assets/twitter.png";
import linkedin from "../../Assets/linkedin (1).png";
import whatsapp from "../../Assets/logos_whatsapp-icon.png";
import email from "../../Assets/Group 39487.png";
import MoreBlogs from "./MoreBlogs";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoIosMail } from "react-icons/io";

const BlogDetails = () => {
  const { category_name } = useParams();
  const { title } = useParams();
  const navigate = useNavigate();
  const id = title?.split("-").pop();

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [helmetKey, setHelmetKey] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  // ✅ Fetch single blog for details
  useEffect(() => {
    const fetchSelectedBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.hachion.co/blog/${id}`);
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
        const response = await axios.get("https://api.hachion.co/blog");
        const mappedBlogs = response.data.map((blog) => ({
          ...blog,
          blog_image: blog.blog_image
            ? `https://api.hachion.co/uploads/prod/blogs/${blog.blog_image}`
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

  // ✅ Scroll button
  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHelmetKey((prev) => prev + 1);
  }, [selectedBlog]);

  // ✅ Parse HTML for headings and inline images
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

      const imageUrlRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif))/gi;
      doc.body.innerHTML = doc.body.innerHTML.replace(
        imageUrlRegex,
        '<img src="$1" alt="Image" style="max-width:100%; display:block; margin:10px auto;" />'
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
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`, "_blank"),
    twitter: () =>
      window.open(`https://twitter.com/intent/tweet?url=${blogUrl}`, "_blank"),
    linkedin: () =>
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`, "_blank"),
    whatsapp: () =>
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(blogUrl)}`, "_blank"),
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
              ? `https://api.hachion.co/blogs/${selectedBlog.blog_image}`
              : "https://hachion.co/images/course-banner.jpg"
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content={"article"} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="home-background">
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
                    src={`https://api.hachion.co/blogs/${selectedBlog.blog_image}`}
                    alt={selectedBlog.title}
                    onError={handleImageError}
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
                    <h1>{selectedBlog.title}</h1>
                  </div>
                </div>

                {headings.length > 0 && (
                  <div className="table-of-contents">
                    <h3>Topics</h3>
                    <ul>
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(h.id)?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }}
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="topics"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              </>
            ) : (
              <p>Loading blog...</p>
            )}

            <div className="detail-right">
              <div className="detail-right-icon">
                <p>Share :</p>
                <FaFacebookF className="detail-right-social" onClick={shareLinks.facebook} />
                <FaTwitter className="detail-right-social" onClick={shareLinks.twitter} />
                <FaLinkedinIn className="detail-right-social" onClick={shareLinks.linkedin} />
                <IoLogoWhatsapp className="detail-right-social" onClick={shareLinks.whatsapp} />
                <IoIosMail className="detail-right-social" onClick={shareLinks.email} />
              </div>
            </div>
          </div>

          {/* ✅ RECENT POSTS with Skeleton Loader */}
          <div className="detail-blog-left">
            <h3>Recent Post</h3>
            {recentLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div className="recent-post-skeleton" key={i}>
                    <div className="recent-skeleton-image"></div>
                    <div className="recent-skeleton-text subtitle"></div>
                    <div className="recent-skeleton-text title"></div>
                  </div>
                ))
              : blogs.length > 0 ? (
                  blogs.slice(0, 5).map((blog) => (
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
                ) : (
                  <p>No blogs available</p>
                )}
          </div>
        </div>

        <div className="blog-bottom">
          <MoreBlogs scrollToTop={false} />
        </div>
        <Footer />
      </div>

      {showScrollButton && <StickyBar />}
    </>
  );
};

export default BlogDetails;
