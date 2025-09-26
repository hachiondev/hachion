// import React, { useRef, useEffect, useState } from "react";
// import axios from "axios";
// import RecentEntriesCard from "./RecentEntriesCard";
// import "./Blogs.css";
// import { useNavigate } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import { IoIosArrowForward } from "react-icons/io";
// import { Carousel } from "react-bootstrap";
// const RecentEntries = () => {
//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);
//   const [blogs, setBlogs] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);
//   const blogsPerPage = 3;
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await axios.get("https://api.test.hachion.co/blog");
//         setBlogs(response.data.reverse()); 
//       } catch (error) {
//         console.error("Error fetching blog data:", error);
//       }
//     };

//     fetchBlogs();
//   }, []);
//   // Calculate the visible blogs
//   const visibleBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);
//   // Function to go to next set of blogs
//   const handleNext = () => {
//     if (startIndex + blogsPerPage < blogs.length) {
//       setStartIndex(startIndex + blogsPerPage);
//       scrollContainerRef.current.scrollLeft += 400; // Move left
//     }
//   };

//   // Function to go to previous set of blogs
//   const handlePrev = () => {
//     if (startIndex - blogsPerPage >= 0) {
//       setStartIndex(startIndex - blogsPerPage);
//       scrollContainerRef.current.scrollLeft -= 400; // Move right
//     }
//   };

//   // Split blogs into groups of 3 for carousel items
//   const groupedBlogs = [];
//   for (let i = 0; i < blogs.length; i += 3) {
//     groupedBlogs.push(blogs.slice(i, i + 3));
//   }

//   const goToPrev = () => {
//     setActiveIndex((prevIndex) =>
//       prevIndex === 0 ? groupedBlogs.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % groupedBlogs.length);
//   };

//   return (
//     <div className="recent-entries-container">

//       {/* Bootstrap Carousel */}
//       <div id="recentEntriesCarousel" className="carousel slide">
//         <div className="carousel-inner">
//           <Carousel
//             activeIndex={activeIndex}
//             onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//             indicators={false}
//             controls={false}
//             interval={null}
//           >
//             {groupedBlogs.map((group, index) => (
//               <div
//                 className={`carousel-item ${index === 0 ? "active" : ""}`}
//                 key={index}
//               >
//                 <div className="workshop-entries">
//                   {group.map((blog) => (
//                     <RecentEntriesCard
//                       key={blog.id}
//                       imageSrc={`https://api.test.hachion.co/blogs/${blog.blog_image}`}
//                       content={blog.title}
//                       category={blog.category_name}
//                       description={blog.blog_description}
//                       author={blog.authorName}
//                       avatarSrc={blog.avatar}
//                       // views={blog.views || "100"}
//                       // date={blog.date}
//                      date={(() => {
//                       if (!blog?.date) return 'Loading...';
//                       const d = new Date(blog.date);
//                       const options = { year: 'numeric', month: 'long', day: 'numeric' };
//                       return d.toLocaleDateString('en-US', options);
//                     })()}
//                       onClick={() => {
//                         navigate(
//                           `/blogs/${blog.category_name
//                             .replace(/\s+/g, "-")
//                             .toLowerCase()}/${blog.id}`
//                         );
//                         window.scrollTo(0, 0); // Scrolls to the top
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </Carousel>
//         </div>
//       </div>
//       {/* Buttons at Bottom */}
//       <div className="carousel-controls">
//         <button
//           className="arrow custom-prev"
//           data-bs-target="#recentEntriesCarousel"
//           data-bs-slide="prev"
//           aria-label="Previous Slide"
//           onClick={goToPrev}
//         >
//           <IoIosArrowBack />
//         </button>
//         {/* Carousel Indicators */}
//         <div className="indicator-wrapper">
//           <ul className="carousel-indicators-line">
//             {groupedBlogs.map((_, index) => (
//               <li
//                 key={index}
//                 onClick={() => setActiveIndex(index)}
//                 className={index === activeIndex ? "active" : ""}
//               />
//             ))}
//           </ul>
//         </div>

//         <button
//           className="arrow custom-next"
//           data-bs-target="#recentEntriesCarousel"
//           data-bs-slide="next"
//            aria-label="Next Slide"
//           onClick={goToNext}
//         >
//           <IoIosArrowForward />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RecentEntries;

import React, { useEffect, useState } from "react";
import axios from "axios";
import RecentEntriesCard from "./RecentEntriesCard";
import "./Blogs.css";
import { useNavigate } from "react-router-dom";

const RecentEntries = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/blog");
        setBlogs(response.data.reverse()); // newest first
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Limit to first 6 blogs
  const visibleBlogs = blogs.slice(0, 6);

  return (
     <div className="home-faq-banner container">
      <h2 className='home-blog-title'>Trending Blog</h2>
      <p className="learner-title-tag">Discover our useful resources and read articles on different categories</p>
    <div className="recent-entries-container">
    <div className="recent-entries-grid">
      {visibleBlogs.map((blog) => (
        <RecentEntriesCard
          key={blog.id}
          imageSrc={`https://api.test.hachion.co/blogs/${blog.blog_image}`}
          content={blog.title}
          category={blog.category_name}
          description={blog.blog_description}
          author={blog.authorName}
          avatarSrc={blog.avatar}
          date={(() => {
            if (!blog?.date) return "Loading...";
            const d = new Date(blog.date);
            const options = { year: "numeric", month: "long", day: "numeric" };
            return d.toLocaleDateString("en-US", options);
          })()}
          onClick={() => {
            navigate(
              `/blogs/${blog.category_name
                .replace(/\s+/g, "-")
                .toLowerCase()}/${blog.id}`
            );
            window.scrollTo(0, 0);
          }}
        />
      ))}
    </div>
    </div>
    <button
  className="home-start-button"
  onClick={() => {
    navigate("/blogs");}}>
  View More Blogs
</button>
    </div>
  );
};

export default RecentEntries;
