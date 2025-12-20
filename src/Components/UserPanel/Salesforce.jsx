import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import RecentEntriesCard from '../../RecentEntriesCard';
import { MdKeyboardArrowRight } from "react-icons/md";

const Salesforce = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/blog");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const decodedCategory = category?.replace(/-/g, " ").toLowerCase();

  const filteredBlogs = blogs.filter(
    (blog) => blog.category_name?.toLowerCase() === decodedCategory
  );

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='blog'>
        <div className='blog-banner'>
          <h3 className='blog-banner-content'>{category?.replace(/-/g, " ")}</h3>
        </div>
        <p className='blogs-header'>
          Home <MdKeyboardArrowRight /> Blogs <MdKeyboardArrowRight /> {category?.replace(/-/g, " ")}
        </p>

        <div className='batch-type' style={{ width: '80%', marginLeft: '10vw' }}>
          <p className='batch-type-content'>Publications</p>
          <p className='batch-type-content'>Interview Questions</p>
          <p className='batch-type-content'>FAQ's</p>
          <p className='batch-type-content'>Videos</p>
        </div>

        {/* Filtered Category Blogs */}
        <div className='card-holder'>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <RecentEntriesCard
                key={blog.id}
                imageSrc={`https://api.test.hachion.co/blogs/${blog.blog_image}`}
                content={blog.title}
                views={blog.views || '100'}
                date={blog.date}
                onClick={() =>
                  window.location.href = `/blogs/${blog.category_name.replace(/\s+/g, '-').toLowerCase()}/content`
                }
              />
            ))
          ) : (
            <p>No blog posts found for this category.</p>
          )}
        </div>

        {/* All Recent Blogs */}
        <div className='blog-bottom'>
          <h1 className='blog-heading'>Recent Entries</h1>
          <div className='recent-entries'>
            {blogs.map((blog) => (
              <RecentEntriesCard
                key={blog.id}
                imageSrc={`https://api.test.hachion.co/blogs/${blog.blog_image}`}
                content={blog.title}
                views={blog.views || '100'}
                date={blog.date}
                onClick={() =>
                  window.location.href = `/blogs/${blog.category_name.replace(/\s+/g, '-').toLowerCase()}/content`
                }
              />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Salesforce;
