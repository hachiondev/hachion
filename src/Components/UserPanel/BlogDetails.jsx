import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import "./Blogs.css";
import facebook from "../../Assets/facebook.png";
import twitter from "../../Assets/twitter.png";
import linkedin from "../../Assets/linkedin (1).png";
import whatsapp from "../../Assets/logos_whatsapp-icon.png";
import email from "../../Assets/Group 39487.png";
import { FaUserTie } from "react-icons/fa6";
import LatestArticles from "./LatestArticles";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet-async";

const BlogDetails = () => {
  const { category_name } = useParams();
  
  const { title } = useParams();
const id = title?.split("-").pop();
  const [blogs, setBlogs] = useState([]);
  const [helmetKey, setHelmetKey] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`https://api.test.hachion.co/blog/${id}`);
        setBlogs(response.data);
        setSelectedBlog(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogs();
  }, [id]);

  useEffect(() => {
    setHelmetKey((prev) => prev + 1);
  }, [selectedBlog]);

  const handleDownload = () => {
    if (selectedBlog && selectedBlog.blog_pdf) {
      const pdfUrl = `https://api.test.hachion.co/blogs/${selectedBlog.blog_pdf}`;
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
    window.open(facebookShareUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`;
    window.open(linkedInShareUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${blogUrl}`;
    window.open(twitterShareUrl, "_blank");
  };

  const shareOnWhatsapp = () => {
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(blogUrl)}`;
  window.open(whatsappShareUrl, "_blank");
};

const shareOnEmail = () => {
  const rawBlogUrl = window.location.href;
  const emailSubject = "Check out this blog!";
  const emailBody = `I thought you might like this blog: ${rawBlogUrl}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  window.open(gmailUrl, "_blank");
};

useEffect(() => {
  if (selectedBlog?.description) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(selectedBlog.description, "text/html");
    const foundHeadings = [];
    const headingTags = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headingTags.forEach((heading) => {
      const text = heading.textContent.trim();
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
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
              ? `https://api.test.hachion.co/blogs/${selectedBlog.blog_image}`
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
              {category_name?.replace(/-/g, " ") || "Loading..."}
            </li>
          </ol>
        </nav>
      </div>

        <div className="detail-blog container">
        <div className="detail-blog-right">
          <div className="detail-right">
            {/* <button className="btn-curriculum" onClick={handleDownload}>
              <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download
            </button> */}
            <div className="detail-right-icon">
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
              <img
                src={whatsapp}
                alt="WhatsApp"
                style={{ cursor: "pointer" }}
                onClick={shareOnWhatsapp}
              />
              <img
                src={email}
                alt="Email"
                style={{ cursor: "pointer" }}
                onClick={shareOnEmail}
              />
            </div>
          </div>

          {selectedBlog ? (
            <>
            <div className="detail-middle">
                <img
                  src={`https://api.test.hachion.co/blogs/${selectedBlog.blog_image}`}
                  alt={selectedBlog.title}
                />
                <div>
                  <div className="detail-top">
                    {/* <h5>
                      <FaUserTie className="user-icon" /> {selectedBlog.author}
                    </h5> */}
                    {/* <h5>{selectedBlog.views || "100"} Views</h5> */}
                    <div className="detail-top-date">
                      {(() => {
                        const d = new Date(selectedBlog.date);
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        const yyyy = d.getFullYear();
                        return `${mm}-${dd}-${yyyy}`;
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
            <p>No blog selected.</p>
          )}
        </div>

        <div className="detail-blog-left">
          <h3>Recent Post</h3>
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
      </div>

      <div className='blog-bottom'>
        <LatestArticles />
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default BlogDetails;