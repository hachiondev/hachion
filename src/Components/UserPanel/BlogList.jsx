import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
const BlogList = ({ selectedCategories }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    axios
      .get("https://api.hachion.co/blog")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Error fetching blogs", error));
  }, []);

  useEffect(() => {
    console.log(
      "Received Selected Categories in BlogList:",
      selectedCategories
    );
  }, [selectedCategories]); // Debugging output
  // Filter blogs based on selected categories
  useEffect(() => {
    console.log("Filtering Blogs with:", selectedCategories);
  }, [selectedCategories]); // Debug filtering in BlogList

  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  useEffect(() => {
    console.log("Filtering Blogs Now:", selectedCategories);
    console.log("Selected Categories Length:", selectedCategories.length);

    const newFilteredBlogs =
      selectedCategories.length > 0
        ? blogs.filter(
            (blog) =>
              blog.category_name &&
              selectedCategories.includes(blog.category_name.trim())
          )
        : blogs;

    setFilteredBlogs(newFilteredBlogs);
    setCurrentPage(1);
    console.log(
      "Updated Filtered Blogs BEFORE state update:",
      newFilteredBlogs
    );
  }, [selectedCategories, blogs]);

  const blogsPerPage = 6;
  console.log("currentpage", currentPage);
  // Calculate the range of blogs to display
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(currentBlogs.length);
  return (
    <div>
      <div className="blog-list p-2">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <div key={blog.id} className="bloglist-card">
              <img
                src={`https://api.hachion.co/blogs/${blog.blog_image}`}
                className="card-img-top"
                alt="Blog-Image"
              />
              <div className="card-body">
                <h5 className="main-content fw-bold">{blog.title}</h5>
                <div className="blogs-row">
                {/* <p className="card-text">
                  <i>{blog.author}</i>
                </p> */}
                <p className="card-text">
                  {new Date(blog.date)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .replace(",", "")}
                </p>
                {/* <a
                  href={`/blogs/${blog.category_name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}/${blog.id}`}
                  className="txtReadmore"
                > */}
{/* <a
  href={`/blogs/${blog.category_name
    .replace(/\s+/g, "-")
    .toLowerCase()}/${blog.title
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase()}`}
  className="txtReadmore"
> */}
<a
  href={`/blogs/${blog.category_name
    .replace(/\s+/g, "-")
    .toLowerCase()}/${blog.title
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase()}-${blog.id}`}
  className="txtReadmore"
>
                  Read More
                </a>
              </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found for the selected categories.</p>
        )}
      </div>
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
