// import { useEffect, useState } from "react";
// import axios from "axios";
// import Topbar from './Topbar'
// import NavbarTop from './NavbarTop'
// import './Corporate.css';
// import {MdKeyboardArrowRight} from 'react-icons/md';
// import RecentEntries from './RecentEntries';
// import Footer from './Footer';
// import StickyBar from './StickyBar';
// import BlogCard from './BlogCard';
// import blogicon from '../../Assets/blogicon.png';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';

// const Blogs = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("https://api.hachion.co/course-categories/all");
//         setCategories(response.data); // assuming the API returns an array of categories
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);
//   const navigate=useNavigate();

//   const handleClick = (categoryName) => {
//     const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/blogs/${slug}`);
//   };
  
//   return (
//     <>
//     <Helmet>
//       <title>Hachion's Blog | Online learning news, trends & insights</title>
//       <meta name="description" content="Get the latest from Hachion, a global online learning platform offering world-class learning experiences to transform lives worldwide." />
//       <meta name="keywords" content="IT training, Software Courses, Blogs, Technology, Latest insights" />
//       <meta property="og:title" content="Online IT Training: Get Certified, Find Your Dream Job" />
//       <meta property="og:description" content="Learn online with the best courses at Hachion." />
//       <meta property="og:image" content="/Hachion-logo.png" />
//       <link rel="canonical" href="https://hachion.co/blogs" />
//       <script type="application/ld+json">
//         {`
//           {
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             "name": "Hachion",
//             "url": "https://www.hachion.co",
//             "logo": "https://www.hachion.co/Hachion-logo.png",
//             "sameAs": [
//             "https://www.facebook.com/hachion.co",
//             "https://x.com/hachion_co",
//             "https://www.linkedin.com/company/hachion",
//             "https://www.instagram.com/hachion_trainings",
//             "https://www.quora.com/profile/Hachion-4",
//             "https://www.youtube.com/@hachion"
//           ]
//           }
//         `}
//       </script>
//     </Helmet>
//     <Topbar/>
//     <NavbarTop/>
//     <div className='blog'>
//     <div className='blog-banner'>
//         <h3 className='blog-banner-content'>Blogs</h3>
//     </div>
//     <div className='blogs-header'>
//       <nav aria-label="breadcrumb">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item">
//               <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
//             <li className="breadcrumb-item active" aria-current="page">
//             Blog
//             </li>
//           </ol>
//         </nav>
//         </div>
//    <div className='blog-header'>
//     <h1 className='blog-heading'>Knowledge hub</h1>

//    </div>

//    <div className="blogs-container">
//       {categories.map((category, index) => (
//      <BlogCard
//      key={index}
//      imageSrc={category.imageUrl || blogicon}
//      content={category.name}
//      onClick={() => handleClick(category.name)}
//    />
   
//       ))}
//     </div>
     
// <div className='blog-bottom'>
// <h2 className='blog-heading'>Recent Entries</h2>
// <RecentEntries/>
// </div>

// <Footer/>
// <StickyBar/>
// </div>
//     </>
//   )
// }

// export default Blogs

import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import "./Bloglist.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import RecentEntries from "./RecentEntries";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import BlogCard from "./BlogCard";
import BlogsSidebar from "./BlogsSidebar";
import blogicon from "../../Assets/blogicon.png";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogList from "./BlogList";
const Blogs = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.hachion.co/course-categories/all"
        );
        setCategories(response.data); // assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("Selected Categories in Blog.jsx:", selectedCategories);
  }, [selectedCategories]);

  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/blogs/${slug}`);
  };

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
      <div className="blog">
        <div className="blog-banner">
          <h1 className="blog-banner-content">Hachion Tech Blog</h1>
        </div>
        <div className="blogs-header">
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
        </div>
        {/* <div className="blog-header">
          <h1 className="blog-heading">Hachion Tech Blog</h1>
        </div> */}
        <div className="mobile-filter-toggle">
          <button
            className="clear-button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="blog-container">
          <BlogsSidebar
            showMobileFilters={showMobileFilters}
            onFilterChange={setSelectedCategories}
          />
          <BlogList selectedCategories={selectedCategories} />
          {/* {categories.map((category, index) => (
            <BlogCard
              key={index}
              imageSrc={category.imageUrl || blogicon}
              content={category.name}
              onClick={() => handleClick(category.name)}
            />
          ))} */}
        </div>
      </div>
      {/* <div className="blog-bottom">
          <h2 className="blog-heading">Recent Entries</h2>
          <RecentEntries />
        </div> */}
      <Footer />
      <StickyBar />
    </>
  );
};

export default Blogs;