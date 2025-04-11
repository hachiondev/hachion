import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import './Blogs.css';
import facebook from '../../Assets/facebook.png';
import twitter from '../../Assets/twitter.png';
import linkedin from '../../Assets/linkedin.png';
import { FaUserTie } from "react-icons/fa6";
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import automation from '../../Assets/automationtesting.png';
import { Helmet } from 'react-helmet-async';

const QaTestingBlog = () => {
  const { category_name } = useParams(); // Get category from URL
  const [blogs, setBlogs] = useState([]); // State for API data
const [helmetKey, setHelmetKey] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/blog");
        const originalCategory = category_name.replace(/-/g, ' ');
        const filteredBlogs = response.data.filter(blog => blog.category_name?.toLowerCase() === originalCategory.toLowerCase());
        
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
    <Helmet key={helmetKey}>
  <title>{blogs?.meta_title || "Hachion Blogs"}</title>
  <meta name="description" content={blogs?.meta_description || "Blogs description"} />
  <meta name="keywords" content={blogs?.meta_keyword || "meta keywords"} />
  <meta property="og:title" content={blogs?.meta_title || "Best Online IT Certification Courses"} />
  <meta property="og:description" content={blogs?.meta_description || "Transform your career with Hachion's Online IT Courses."} />
  <meta property="og:image" content={blogs?.blog_image || "https://hachion.co/images/course-banner.jpg"} />
  <meta property="og:url" content={`https://hachion.co/blogs/${category_name}`} />
  <meta name="robots" content="index, follow" />
</Helmet>
      <Topbar />
      <NavbarTop />
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <a href="/blogs">Blog</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
  {category_name.replace(/-/g, ' ') || "Loading..."}
</li>

          </ol>
        </nav>
      </div>

      <div className='salesforce-blog'>
        <div className='salesforce-blog-left'>
          <h3>Recommended Publications</h3>
          <p>Salesforce admin interview FAQ's</p>
          <p>Salesforce Developer interview FAQ's</p>
        </div>

        <div className='salesforce-blog-right'>
          <div className='salesforce-right'>
            <button className='btn-curriculum' onClick={handleDownload}>
              <BsFileEarmarkPdfFill className='btn-pdf-icon' /> Download
            </button>
            <div className='salesforce-right-icon'>
              <p>Share :</p>
              <img src={facebook} alt='facebook' />
              <img src={twitter} alt='twitter' />
              <img src={linkedin} alt='linkedin' />
            </div>
          </div>

          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className='salesforce-middle'>
                <img src={`https://api.hachion.co/blogs/${blog.blog_image}`} alt={blog.title} />
                <div>
                  <h1>{blog.title}</h1>
                  <div className='salesforce-top'>
                    <h5><FaUserTie className='user-icon' /> {blog.author}</h5>
                    <h5>{blog.views || '100'} Views</h5>
                    {/* <h5>{blog.date}</h5> */}
                    <h5>
                      {(() => {
                        const d = new Date(blog.date);
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        const yyyy = d.getFullYear();
                        return `${mm}-${dd}-${yyyy}`;
                      })()}
                    </h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found for this category.</p>
          )}

        <div
          className="topics"
          dangerouslySetInnerHTML={{ __html: blogs.length > 0 ? blogs[0].description : '' }}
        />
          
        </div>
      </div>

      <div className='salesforce-entries'>
        <h1 className='salesforce-entries-heading'>Recent Entries</h1>
        <RecentEntries />
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default QaTestingBlog;