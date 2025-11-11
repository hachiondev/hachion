import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import "./Bloglist.css";

const BlogList = ({ selectedCategories, currentPage, cardsPerPage, onTotalBlogsChange }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://api.hachion.co/blog");
        const mapped = res.data.map((b) => ({
          ...b,
          avatar: b.authorImage
            ? `https://api.hachion.co/uploads/prod/blogs/${b.authorImage}`
            : "",
          blog_image: b.blog_image
            ? `https://api.hachion.co/uploads/prod/blogs/${b.blog_image}`
            : "",
        }));
        setBlogs(mapped.reverse());
        setFilteredBlogs(mapped);
        onTotalBlogsChange(mapped.length);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [onTotalBlogsChange]);

  // Filter by category
  useEffect(() => {
    let filtered = blogs;
    if (selectedCategories.length > 0) {
      filtered = blogs.filter(
        (b) => b.category_name && selectedCategories.includes(b.category_name.trim())
      );
    }
    setFilteredBlogs(filtered);
    onTotalBlogsChange(filtered.length);
  }, [selectedCategories, blogs, onTotalBlogsChange]);

  // Pagination slice
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  return (
    <div className="blog-list p-2">
      {loading ? (
        Array.from({ length: cardsPerPage }).map((_, i) => (
          <div className="skeleton-card" key={i}></div>
        ))
      ) : currentBlogs.length > 0 ? (
        currentBlogs.map((blog) => (
          <div key={blog.id} className="bloglist-card">
            <img
              src={blog.blog_image}
              alt={blog.title}
              className="recent-blog-card-image"
              onError={handleImageError}
            />
            <div className="content-block">
              {blog.category_name && (
                <span className="category-badge">{blog.category_name}</span>
              )}
              <h3 className="content">{blog.title}</h3>
              <p className="blog-card-description">
                {(() => {
                  const el = document.createElement("div");
                  el.innerHTML = blog.description || "";
                  return (el.textContent || el.innerText || "").trim();
                })()}
              </p>
              <div className="author-info">
                {blog.avatar ? (
                  <img
                    src={blog.avatar}
                    alt={blog.author}
                    className="author-avatar"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <BsPersonCircle size={48} color="#b3b3b3" />
                )}
                <div className="author-details">
                  <p className="blog-author">{blog.author}</p>
                  <p className="date">
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={`/blogs/${blog.category_name?.replace(/\s+/g, "-").toLowerCase()}/${blog.title
                ?.replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .toLowerCase()}-${blog.id}`}
              className="txtReadmore"
            >
              Read More
            </a>
          </div>
        ))
      ) : (
        <p>No blogs found for the selected categories.</p>
      )}
    </div>
  );
};

export default BlogList;
