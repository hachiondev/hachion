import React,{useEffect} from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import './Corporate.css';
import {MdKeyboardArrowRight} from 'react-icons/md';
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import RecentEntriesCard from './RecentEntriesCard';
import salesforce from '../../Assets/salesforce.png';
import salesforceadmin from '../../Assets/salesforceadmin.png';
import salesforceinterview from '../../Assets/salesforceinterview.png';


const Salesforce = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  // This will scroll to the top of the page
  }, []);
  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='blog'>
    <div className='blog-banner'>
        <h3 className='blog-banner-content'>Salesforce</h3>
    </div>
    <p>Home <MdKeyboardArrowRight/> Blogs <MdKeyboardArrowRight/> Salesforce</p>
   
   <div className='batch-type' style={{width:'80%',marginLeft:'10vw'}}>
 <p className='batch-type-content'>Publications</p>
 <p className='batch-type-content'>Interview Questions</p>
 <p className='batch-type-content'>FAQ's</p>
 <p className='batch-type-content'>Videos</p>
   </div>
   <div className='card-holder'>
  <RecentEntriesCard imageSrc={salesforce} content='7 Reasons to Learn Salesforce in 2023 By' 
     username='Sandeep' date='24-09-10'/>
     <RecentEntriesCard imageSrc={salesforceadmin} content='Salesforce admin Interview FAQs' 
     username='Pushpa' date='24-09-10'/>
     <RecentEntriesCard imageSrc={salesforceinterview} content='Salesforce Developer Interview FAQs' 
     username='Ramkrishna' date='24-09-10'/>

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

export default Salesforce