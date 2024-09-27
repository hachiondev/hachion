import React,{useEffect} from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import './Corporate.css';
import {MdKeyboardArrowRight} from 'react-icons/md';
import BlogCardHolder from './BlogCardHolder';
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import StickyBar from './StickyBar';
import RecentEntriesCard from './RecentEntriesCard';
import automation from '../../Assets/automationtesting.png';

const QaTesting = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  // This will scroll to the top of the page
  }, []);
  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='blog'>
    <div className='blog-banner'>
        <h3 className='blog-banner-content'>QA Testing</h3>
    </div>
    <p>Home <MdKeyboardArrowRight/> Blogs <MdKeyboardArrowRight/> Qa Testing</p>
   
   <div className='batch-type' style={{width:'80%',marginLeft:'10vw'}}>
 <p className='batch-type-content'>Publications</p>
 <p className='batch-type-content'>Interview Questions</p>
 <p className='batch-type-content'>FAQ's</p>
 <p className='batch-type-content'>Videos</p>
   </div>
   <div className='card-holder'>
   <RecentEntriesCard imageSrc={automation} content='Importance of Automation in Software Testing' 
     username='Srilatha' date='24-09-10' />
     </div>
<div className='blog-bottom'>
<h1 className='blog-heading'>Recent Entries</h1>
<RecentEntries/>
</div>
<Footer/>
</div>

    </>
  )
}

export default QaTesting