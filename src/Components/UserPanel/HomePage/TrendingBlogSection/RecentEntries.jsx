import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RecentEntriesCard from "./components/RecentEntriesCard";
import { useRecentBlogs } from '../../../../Api/hooks/HomePageApi/TrendingBlogApi/useRecentBlogs';
import "../../Blogs.css";

const RecentEntries = () => {
  const navigate = useNavigate();
  
  // Fetch blogs using TanStack Query
  const { data: blogs = [], isLoading, isError, error } = useRecentBlogs();

  // Memoize date formatter
  const formatDate = useMemo(() => {
    return (dateString) => {
      if (!dateString) return "Loading...";
      const d = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return d.toLocaleDateString("en-US", options);
    };
  }, []);

  // Handler for blog click
  const handleBlogClick = (blog) => {
    const slug = blog.category_name.replace(/\s+/g, "-").toLowerCase();
    navigate(`/blogs/${slug}/${blog.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="training-events container">
      <h2 className="association-head">Trending Blog</h2>
      <p className="association-head-tag">
        Discover our useful resources and read articles on different categories
      </p>
      
      <div className="home-blog-cards">
        <div className="recent-entries-container">
          {/* Loading State */}
          {isLoading && (
            <div className="recent-entries-grid">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="skeleton-card" />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="error-message">
              <p>Failed to load blogs. Please try again later.</p>
              {error && <small>{error.message}</small>}
            </div>
          )}

          {/* Blogs Grid */}
          {!isLoading && !isError && (
            <div className="recent-entries-grid">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <RecentEntriesCard
                    key={blog.id}
                    imageSrc={blog.blog_image}
                    content={blog.title}
                    category={blog.category_name}
                    author={blog.author}
                    avatarSrc={blog.avatar}
                    date={formatDate(blog.date)}
                    onClick={() => handleBlogClick(blog)}
                  />
                ))
              ) : (
                <p>No blogs available at the moment.</p>
              )}
            </div>
          )}
        </div>

        {/* View More Button */}
        {!isLoading && blogs.length > 0 && (
          <button
            className="home-start-button"
            onClick={() => navigate("/blogs")}
          >
            View More Blogs
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentEntries;