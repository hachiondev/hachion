import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/blogplaceholder.webp";
import "./Bloglist.css";

const BlogList = ({
  selectedCategories,
  currentPage,
  cardsPerPage,
  onTotalBlogsChange,
}) => {
  const navigate = useNavigate();
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
            shortTitle,
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
            shortTitle: shortTitle,
            author,
            date,
            avatar: avatarPath
              ? `https://api.test.hachion.co/uploads/test/blogs/${avatarPath}`
              : "",
            blog_image: blogImagePath
              ? `https://api.test.hachion.co/uploads/test/blogs/${blogImagePath}`
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

  // const handleCardClick = (blog) => {
  //  const blogUrl = `/blogs/${blog.category_name
  // ?.replace(/\s+/g, "-")
  // .toLowerCase()}/${blog.shortTitle
  // ?.replace(/\s+/g, "-")
  // .toLowerCase()}`;
  // };
const handleCardClick = (blog) => {
  const categorySlug = blog.category_name
    ?.replace(/\s+/g, "-")
    .toLowerCase();

  const hasShortTitle =
    blog.shortTitle && blog.shortTitle.trim() !== "";

  const titleSlug = blog.title
    ?.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  if (hasShortTitle) {
    navigate(`/blogs/${categorySlug}/${blog.shortTitle
      .toLowerCase()
      .replace(/\s+/g, "-")}`);
  } else {
    navigate(`/blogs/${categorySlug}/${titleSlug}-${blog.id}`);
  }
};
  return (
    <div className="blog-list p-2">
      {loading ? (
        Array.from({ length: cardsPerPage }).map((_, i) => (
          <div className="skeleton-card" key={i}></div>
        ))
      ) : currentBlogs.length > 0 ? (
        currentBlogs.map((blog) => (
          <div 
            key={blog.id} 
            className="bloglist-card"
            onClick={() => handleCardClick(blog)}
            style={{ cursor: "pointer" }}
          >
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
  .toLowerCase()}/${
  blog.shortTitle && blog.shortTitle.trim() !== ""
    ? blog.shortTitle.toLowerCase().replace(/\s+/g, "-")
    : blog.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") + "-" + blog.id
}`}
  className="txtReadmore"
  onClick={(e) => e.stopPropagation()}
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