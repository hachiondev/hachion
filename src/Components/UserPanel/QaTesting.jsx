import React,{useEffect} from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Corporate.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import BlogCourseCards from './BlogCourseCards';
import automation from '../../Assets/automationtesting.png';
import { useNavigate } from 'react-router-dom';

const QaTesting = () => {
  const navigate = useNavigate();

  const handleqatesting = () => {
    console.log('Navigating to QA Testing Blog');
    navigate('/qatestingblog');
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='blog'>
        <div className='blog-banner'>
          <h3 className='blog-banner-content'>QA Testing</h3>
        </div>
        <div className='blogs-header'>
          <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
              <li className="breadcrumb-item">
              <a href="./Blogs">Blogs</a> <MdKeyboardArrowRight/></li>
            <li className="breadcrumb-item active" aria-current="page">
            Qa Testing
            </li>
          </ol>
        </nav>
        </div>
        <div className='blog-batch-type'>
          <p className='blog-batch-type-content'>Publications</p>
          <p className='blog-batch-type-content'>Interview Questions</p>
          <p className='blog-batch-type-content'>FAQ's</p>
          <p className='blog-batch-type-content'>Videos</p>
        </div>
        
        <div className='card-holder'>
          <BlogCourseCards 
            imageSrc={automation} 
            content='Importance of Automation in Software Testing' 
            username='Srilatha' 
            views={100}
            messages={100}
            date='24-09-10' 
            onClick={handleqatesting} 
          />
          <BlogCourseCards 
            imageSrc={automation} 
            content='Importance of Automation in Software Testing' 
            username='Navya' 
            views={120}
            messages={120}
            date='20-09-23' 
            onClick={handleqatesting} 
          />
        </div>
        
        <div className='blog-bottom'>
          <h1 className='blog-heading'>Recent Entries</h1>
          <RecentEntries />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default QaTesting;
