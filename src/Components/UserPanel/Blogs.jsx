import React,{useEffect} from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import './Corporate.css';
import {MdKeyboardArrowRight} from 'react-icons/md';
import BlogCardHolder from './BlogCardHolder';
import RecentEntries from './RecentEntries';
import Footer from './Footer';


const Blogs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  // This will scroll to the top of the page
  }, []);
  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='blog'>
    <div className='blog-banner'>
        <h3 className='blog-banner-content'>Blogs</h3>
    </div>
    <p>Home <MdKeyboardArrowRight/> Blogs</p>
   <div className='blog-header'>
    <h1 className='blog-heading'>Knowledge hub</h1>
    
   </div>
<BlogCardHolder/>
<div className='blog-bottom'>
<h1 className='blog-heading'>Recent Entries</h1>
<RecentEntries/>
</div>

<Footer/>
</div>
    </>
  )
}

export default Blogs