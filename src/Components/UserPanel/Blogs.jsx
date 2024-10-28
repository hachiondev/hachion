import React,{useEffect} from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import './Corporate.css';
import {MdKeyboardArrowRight} from 'react-icons/md';
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import StickyBar from './StickyBar';
import BlogCard from './BlogCard';
import blogImage1 from '../../Assets/blogcardimage1.png';
import blogImage2 from '../../Assets/blogcardimage2.png';
import dataScienceBlog from '../../Assets/DataScienceBlog.png';
import programmingBlog from '../../Assets/ProgrammingBlog.png';
import salesforceblog from '../../Assets/salesforceBlog.png';
import servicenowblog from '../../Assets/ServiceNow.png';
import cloudcomputing from '../../Assets/CloudComputingBlog.png';
import workdayBlog from '../../Assets/WorkdayBlog.png';
import mulesoftBlog from '../../Assets/MulesoftBlog.png';
import cybersecurity from '../../Assets/CybersecurityBlog.png';
import machinelearning from '../../Assets/machineLearningBlog.png';
import blockchain from '../../Assets/blockchainBlog.png';
import deeplearning from '../../Assets/deepLearningBlog.png';
import datawarehousing from '../../Assets/dataWarehousingBlog.png';
import mobiledevelopment from '../../Assets/mobileDevelopment.png';
import bigdata from '../../Assets/bigdataBlog.png';
import Rpa from '../../Assets/rpaBlog.png';
import bpm from '../../Assets/pegaBlog.png';
import flutter from '../../Assets/flutterBlog.png';
import microsoft from '../../Assets/microsoftBlog.png';
import scrummaster from '../../Assets/ScrumBlog.png';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {

  const navigate=useNavigate();
  const handleqa=()=>{
 navigate('/qatesting')
  }
  const handleSalesforce = () => {
    console.log('clicked')
    navigate('/salesforce');
  };
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
   <div className='blogs-container'>
<BlogCard imageSrc={blogImage1} content="Project Management" />
<BlogCard imageSrc={dataScienceBlog} content="Data Science" />
<BlogCard imageSrc={blogImage2} content="QA Testing" onClick={() => handleqa()} />
        <BlogCard imageSrc={programmingBlog} content="Programming" />
        <BlogCard 
            imageSrc={salesforceblog} 
            content="Salesforce" 
            onClick={handleSalesforce}
          />
        <BlogCard imageSrc={servicenowblog} content="Service now" />
        <BlogCard imageSrc={cloudcomputing} content="Cloud Computing" />
        <BlogCard imageSrc={workdayBlog} content="Workday" />
        <BlogCard imageSrc={mulesoftBlog} content="Mulesoft" />
        <BlogCard imageSrc={cybersecurity} content="Cyber Security" />
        <BlogCard imageSrc={machinelearning} content="Machine Learning" />
        <BlogCard imageSrc={blockchain} content="BlockChain" />
        <BlogCard imageSrc={deeplearning} content="Deep Learning" />
        <BlogCard imageSrc={datawarehousing} content="Data Warehousing & ETL" />
        <BlogCard imageSrc={mobiledevelopment} content="Mobile Development" />
        <BlogCard imageSrc={bigdata} content="Big Data" />
        <BlogCard imageSrc={Rpa} content="RPA" />
        <BlogCard imageSrc={bpm} content="BPM" />
        <BlogCard imageSrc={flutter} content="Flutter" />
        <BlogCard imageSrc={microsoft} content="Microsoft" />
        <BlogCard imageSrc={scrummaster} content="ScrumMaster" />
        </div>
<div className='blog-bottom'>
<h1 className='blog-heading'>Recent Entries</h1>
<RecentEntries/>
</div>

<Footer/>
<StickyBar/>
</div>
    </>
  )
}

export default Blogs