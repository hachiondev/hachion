"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import RecentEntriesCard from "./components/RecentEntriesCard";
import { useRecentBlogs } from "@/Api/hooks/HomePageApi/TrendingBlogApi/useRecentBlogs";
import { getBlogPath } from "@/lib/blogUrl";
import "../../Buttons.css";

const RecentEntries = () => {

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

  const getBlogUrl = (blog) => getBlogPath(blog) || "/blogs";

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
                    to={getBlogUrl(blog)}
                    onClick={() => window.scrollTo(0, 0)}
                  />
                ))
              ) : (
                <p>No blogs available at the moment.</p>
              )}
            </div>
          )}
        </div>

        {/* Styled as an <a> directly (not a <button> nested in a Link) so
            it's a single, real, crawlable <a href="/blogs"> — nesting a
            <button> inside an <a> is invalid HTML and was confusing
            Lighthouse's tap-target-size measurement (two overlapping
            interactive elements). Same class the "View FAQS"/"About us"
            Links already use for this exact pattern. */}
        {!isLoading && blogs.length > 0 && (
          <Link href="/blogs" className="home-start-button" style={{ textDecoration: "none" }}>
            View More Blogs
          </Link>
        )}
      </div>
    </div>
  );
};

export default RecentEntries;
