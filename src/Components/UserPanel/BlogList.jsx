import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import "./Bloglist.css";

const BlogList = ({ selectedCategories }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/blog");

        // Map and fix image/author URLs just like LatestArticles
        const mappedBlogs = response.data.map((blog) => ({
          ...blog,
          avatar: blog.authorImage
            ? `https://api.test.hachion.co/uploads/prod/blogs/${blog.authorImage}`
            : "",
          blog_image: blog.blog_image
            ? `https://api.test.hachion.co/uploads/prod/blogs/${blog.blog_image}`
            : "",
        }));

        setBlogs(mappedBlogs.reverse());
        setFilteredBlogs(mappedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const newFiltered = blogs.filter(
        (blog) =>
          blog.category_name &&
          selectedCategories.includes(blog.category_name.trim())
      );
      setFilteredBlogs(newFiltered);
      setCurrentPage(1);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [selectedCategories, blogs]);

  const blogsPerPage = 6;
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  return (
    <div>
      <div className="blog-list p-2">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <div key={blog.id} className="bloglist-card">
              <img
                src={blog.blog_image}
                className="recent-blog-card-image"
                alt={blog.title}
                onError={handleImageError}
              />

              <div className="content-block">
                {/* ✅ Category Badge */}
                {blog.category_name && (
                  <span className="category-badge">{blog.category_name}</span>
                )}

                <h3 className="content">{blog.title}</h3>

                {/* ✅ Description clean-up */}
                <p className="blog-card-description">
                  {(() => {
                    const el = document.createElement("div");
                    el.innerHTML = blog.description || "";
                    return (el.textContent || el.innerText || "").trim();
                  })()}
                </p>

                {/* ✅ Author Info */}
                <div className="author-info">
                  {blog.avatar ? (
                    <div className="avatar-wrapper">
                      <img
                        src={blog.avatar}
                        alt={blog.author}
                        className="author-avatar"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div
                        className="avatar-fallback"
                        style={{ display: "none" }}
                      >
                        <BsPersonCircle size={48} color="#b3b3b3" />
                      </div>
                    </div>
                  ) : (
                    <div className="author-avatar avatar-fallback">
                      <BsPersonCircle size={48} color="#b3b3b3" />
                    </div>
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

              {/* ✅ Read More link */}
              <a
                href={`/blogs/${blog.category_name
                  ?.replace(/\s+/g, "-")
                  .toLowerCase()}/${blog.title
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

      {/* ✅ Pagination */}
      <div className="pagination">
        <button
          className="arrow"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => paginate(num + 1)}
            className={currentPage === num + 1 ? "active" : ""}
          >
            {num + 1}
          </button>
        ))}

        <button
          className="arrow"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default BlogList;
