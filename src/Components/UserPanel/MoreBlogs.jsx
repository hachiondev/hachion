import React, { useEffect, useState } from "react";
import axios from "axios";
import CardsPagination from "./CardsPagination";
import "./Blogs.css";
import { useNavigate } from "react-router-dom";
import RecentEntriesCard from "./TrendingBlogSection/components/RecentEntriesCard";

const MoreBlogs = ({ scrollToTop = false }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  // ✅ Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://api.hachion.co/blog");
        const mappedBlogs = response.data.map((blog) => ({
          ...blog,
          avatar: blog.authorImage
            ? `https://api.hachion.co/uploads/prod/blogs/${blog.authorImage}`
            : "",
          blog_image: blog.blog_image
            ? `https://api.hachion.co/uploads/prod/blogs/${blog.blog_image}`
            : "",
        }));

        // Sort blogs by latest date
        const sortedBlogs = mappedBlogs.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ Dynamically adjust cards per page based on screen width
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;

      if (width <= 480) {
        setCardsPerPage(1); // small phones
      } else if (width <= 768) {
        setCardsPerPage(2); // tablets
      } else if (width <= 1024) {
        setCardsPerPage(3); // small laptops
      } else {
        setCardsPerPage(4); // desktops
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const start = currentPage - 1;
  const end = start + cardsPerPage;
  const currentBlogs = blogs.slice(start, end);

  const handlePageChange = (page) => {
    const totalCards = blogs.length;
    const maxPage = Math.max(totalCards - cardsPerPage + 1, 1);
    const next = Math.min(Math.max(page, 1), maxPage);

    setCurrentPage(next);

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">More Blogs</h2>
        </div>

        {/* Pagination Arrows next to title */}
        {blogs.length > cardsPerPage && (
          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={blogs.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Blog Cards */}
      <div className="home-blog-cards">
        <div className="recent-entries-container">
          <div className="recent-entries-grid">
            {loading ? (
              Array.from({ length: cardsPerPage }).map((_, index) => (
                <div className="skeleton-card" key={index}></div>
              ))
            ) : currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => (
                <RecentEntriesCard
                  key={blog.id}
                  imageSrc={blog.blog_image}
                  content={blog.title}
                  category={blog.category_name}
                  description={blog.description}
                  author={blog.author}
                  avatarSrc={blog.avatar}
                  date={(() => {
                    if (!blog?.date) return "Loading...";
                    const d = new Date(blog.date);
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    return d.toLocaleDateString("en-US", options);
                  })()}
                  onClick={() => {
                    navigate(
                      `/blogs/${blog.category_name
                        ?.replace(/\s+/g, "-")
                        .toLowerCase()}/${blog.id}`
                    );
                    window.scrollTo(0, 0);
                  }}
                />
              ))
            ) : (
              <p>No blogs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreBlogs;
