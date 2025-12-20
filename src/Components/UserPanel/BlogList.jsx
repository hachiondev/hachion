import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import "./Bloglist.css";

const BlogList = ({
  selectedCategories,
  currentPage,
  cardsPerPage,
  onTotalBlogsChange,
}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchBlogs = async () => {
      
      if (!selectedCategories || selectedCategories.length === 0) {
        setBlogs([]);
        onTotalBlogsChange(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("https://api.test.hachion.co/blog/filter", {
          
          params: { category: selectedCategories },
        });

        
        const mapped = res.data.map((row) => {
          const [
            id,
            category_name,
            title,
            author,
            author_image,
            blog_image,
            date,
          ] = row;

          const avatarPath = author_image || "";
          const blogImagePath = blog_image || "";

          return {
            id,
            category_name,
            title,
            author,
            date,
            avatar: avatarPath
              ? `https://api.test.hachion.co/uploads/prod/blogs/${avatarPath}`
              : "",
            blog_image: blogImagePath
              ? `https://api.test.hachion.co/uploads/prod/blogs/${blogImagePath}`
              : "",
          };
        });        
        const finalBlogs = mapped; 
        setBlogs(finalBlogs);
        onTotalBlogsChange(finalBlogs.length);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategories, onTotalBlogsChange]);

  
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

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

              {/* 🔻 Description removed – backend no longer sends it */}

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
                    {blog.date
                      ? new Date(blog.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            </div>
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
        <p>Please select category.</p>
      )}
    </div>
  );
};

export default BlogList;
