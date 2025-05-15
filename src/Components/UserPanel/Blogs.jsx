import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import './Corporate.css';
import {MdKeyboardArrowRight} from 'react-icons/md';
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import StickyBar from './StickyBar';
import BlogCard from './BlogCard';
import blogicon from '../../Assets/blogicon.png';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/course-categories/all");
        setCategories(response.data); // assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const navigate=useNavigate();

  const handleClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blogs/${slug}`);
  };
  
  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='blog'>
    <div className='blog-banner'>
        <h3 className='blog-banner-content'>Blogs</h3>
    </div>
    <div className='blogs-header'>
      <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
            <li className="breadcrumb-item active" aria-current="page">
            Blog
            </li>
          </ol>
        </nav>
        </div>
   <div className='blog-header'>
    <h1 className='blog-heading'>Knowledge hub</h1>

   </div>

   <div className="blogs-container">
      {categories.map((category, index) => (
     <BlogCard
     key={index}
     imageSrc={category.imageUrl || blogicon}
     content={category.name}
     onClick={() => handleClick(category.name)}
   />
   
      ))}
    </div>
     
<div className='blog-bottom'>
<h2 className='blog-heading'>Recent Entries</h2>
<RecentEntries/>
</div>

<Footer/>
<StickyBar/>
</div>
    </>
  )
}

export default Blogs