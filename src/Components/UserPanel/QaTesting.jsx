import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Corporate.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

// Lazy load BlogCourseCards and RecentEntries components for optimization
const BlogCourseCards = React.lazy(() => import('./BlogCourseCards'));
const RecentEntries = React.lazy(() => import('./RecentEntries'));

const QaTesting = () => {
  const navigate = useNavigate();
  const [selectedBatchType, setSelectedBatchType] = useState('Publications'); // State to manage selected batch type
  const [isLoading, setIsLoading] = useState(false); // Loading state for batch change

  // Function to handle navigation to QA Testing blog
  const handleqatesting = () => {
    console.log('Navigating to QA Testing Blog');
    navigate('/qatestingblog');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to render BlogCourseCards based on selected batch type
  const renderBlogCards = useCallback(() => {
    switch (selectedBatchType) {
      case 'Publications':
        return (
          <>
            <BlogCourseCards 
              imageSrc={require('../../Assets/automationtesting.png')} 
              content='Importance of Automation in Software Testing' 
              username='Srilatha' 
              views={100}
              messages={100}
              date='24-09-10' 
              onClick={handleqatesting} 
            />
            <BlogCourseCards 
              imageSrc={require('../../Assets/automationtesting.png')} 
              content='Importance of Automation in Software Testing' 
              username='Navya' 
              views={120}
              messages={120}
              date='20-09-23' 
              onClick={handleqatesting} 
            />
          </>
        );
      case 'Interview Questions':
        return (
          <>
            <BlogCourseCards 
              imageSrc={require('../../Assets/automationtesting.png')} 
              content='QA Automation Interview Preparation Tips' 
              username='Doe' 
              views={150}
              messages={90}
              date='15-06-21' 
              onClick={handleqatesting} 
            />
          </>
        );
      case "FAQ's":
        return (
          <>
            <BlogCourseCards 
              imageSrc={require('../../Assets/automationtesting.png')} 
              content='Frequently Asked Questions about QA Automation' 
              username='Jane' 
              views={80}
              messages={50}
              date='25-08-22' 
              onClick={handleqatesting} 
            />
            <BlogCourseCards 
              imageSrc={require('../../Assets/automationtesting.png')} 
              content='QA Automation: Common Issues and Solutions' 
              username='Mike' 
              views={130}
              messages={110}
              date='10-05-21' 
              onClick={handleqatesting} 
            />
          </>
        );
      case 'Videos':
        return (
          <>
            <div className="video-card">
              <iframe
                src="httpss://www.youtube.com/embed/VIDEO_ID_1"  // Replace VIDEO_ID_1 with actual YouTube video ID
                title="QA Automation Tutorial Video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-card-content">
                <p className="video-title">QA Automation Tutorial Video</p>
                <p className="video-description">A comprehensive guide to QA Automation techniques.</p>
              </div>
            </div>

            <div className="video-card">
              <iframe
                src="httpss://www.youtube.com/embed/VIDEO_ID_2"  // Replace VIDEO_ID_2 with actual YouTube video ID
                title="Introduction to Automation Testing Video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-card-content">
                <p className="video-title">Introduction to Automation Testing Video</p>
                <p className="video-description">Learn the basics of automation testing with real examples.</p>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  }, [selectedBatchType]);

  // Memoized callback to change batch type
  const handleBatchTypeChange = useCallback((batchType) => {
    setIsLoading(true);
    setSelectedBatchType(batchType);
    setIsLoading(false);
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
                <a href="/">Home</a> <MdKeyboardArrowRight /> </li>
              <li className="breadcrumb-item">
                <a href="./Blogs">Blogs</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                QA Testing
              </li>
            </ol>
          </nav>
        </div>

        <div className='blog-batch-type'>
          <p 
            className={`blog-batch-type-content ${selectedBatchType === 'Publications' ? 'active' : ''}`} 
            onClick={() => handleBatchTypeChange('Publications')}
          >
            Publications
          </p>
          <p 
            className={`blog-batch-type-content ${selectedBatchType === 'Interview Questions' ? 'active' : ''}`} 
            onClick={() => handleBatchTypeChange('Interview Questions')}
          >
            Interview Questions
          </p>
          <p 
            className={`blog-batch-type-content ${selectedBatchType === "FAQ's" ? 'active' : ''}`} 
            onClick={() => handleBatchTypeChange("FAQ's")}
          >
            FAQ's
          </p>
          <p 
            className={`blog-batch-type-content ${selectedBatchType === 'Videos' ? 'active' : ''}`} 
            onClick={() => handleBatchTypeChange('Videos')}
          >
            Videos
          </p>
        </div>
        
        <div className='card-holder'>
          {/* Render the blog cards based on the selected batch type */}
          {isLoading ? <div>Loading...</div> : <Suspense fallback={<div>Loading...</div>}>{renderBlogCards()}</Suspense>}
        </div>
        
        <div className='blog-bottom'>
          <h1 className='blog-heading'>Recent Entries</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <RecentEntries />
          </Suspense>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default QaTesting;
