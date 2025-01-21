import React from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import './Blogs.css';
import facebook from '../../Assets/facebook.png';
import twitter from '../../Assets/twitter.png';
import linkedin from '../../Assets/linkedin (1).png';
import salesforce from '../../Assets/salesforce.png';
import { FaUser } from "react-icons/fa";
import RecentEntries from './RecentEntries';
import Footer from './Footer';
import StickyBar from './StickyBar';

const SalesforceBlog = () => {
  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='salesforce-blog'>
    <div className='salesforce-blog-left'>
 <h3>Recommended Publications</h3>
 <p>Salesforce admin interview FAQ's</p>
 <p>Salesforce Developer interview FAQ's</p>
    </div>
<div className='salesforce-blog-right'>
    <div className='salesforce-right'>
<button className='btn-curriculum'>
          <BsFileEarmarkPdfFill style={{ height: '40px', width: '30px', color: 'red' }} />Download
        </button>
        <p>Share :</p>
        <img src={facebook} alt='facebook' />
        <img src={twitter} alt='twitter'/>
        <img src={linkedin} alt='linkedin'/>
        </div>
        <div className='salesforce-middle'>
            <img src={salesforce} alt='salesforce'/>
            <div>
            <h1>7 Reasons to Learn Salesforce in 2023 By</h1>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <h5><FaUser/>  Sandeep</h5>
              <h5>100 Views</h5>
              <h5>24-09-10</h5>
           </div>
           </div>
           </div>
           <div className='topics'>
            <h2>Overview of Topics</h2>
            <p>1. Job Opportunities </p>
            <p>2. High Salaries </p>
            <p>3. Growth Opportunities </p>
            <p>4. Opportunity to work in big companies  </p>
            <p>5. Global Demand </p>
            <p>6. World #1 CRMand growing </p>
            <p>7. Digital World </p>

            <p className='topic-content'>Seven reasons to learn Salesforce<br/>
Salesforce is the world’s number #1 CRM platform. It is expected to generate 3.3M jobs globally in the<br/>
 Salesforce eco-system by the year 2022.<br/>
The demand for Salesforce talent is HUGE…. It’s time for you to get into action.<br/>
Michael Parker, Team Leader – Salesforce CRM, Networkers offers his advice to those professionals looking to<br/>
 build a career in Salesforce:<br/>
“Although experience is something that many companies require, in the first place having the training with<br/>
 Salesforce skills is essential. A good thing about Salesforce roles is that they don’t require an IT degree to <br/>
  build a career with the system. Many technology professionals who have experience working with legacy CRM tools<br/>
   like Siebel or MS Dynamics will find that adding a Salesforce skill will enhance their<br/>
    salary as they can then work on more modern Salesforce systems. In fact, some companies are now upskilling these<br/>
     people with Salesforce skills as a way of getting the right skills into their business.”<br/>

<span className='topic-content-span'>1.Job Opportunities</span><br/>
Salesforce eco-system is expected to generate 3.3M jobs by the year 2022 globally. In India alone, there are<br/>
 4500+ jobs for Salesforce developer on the Naukri job portal. The demand for Salesforce professionals is <br/>
 increasing at a phenomenal rate.<br/>
<span className='topic-content-span'>2. High Salaries</span><br/>
Salesforce professionals command among the highest salaries in the market. Typical Salesforce salaries in the<br/>
 international market are given below.<br/>
<span className='topic-content-span'>3. Growth Opportunities</span><br/>
A career in Salesforce provides tremendous growth opportunities. One can start as a developer or an<br/>
 administrator to move to Business Analyst or Architect positions. Salesforce offers the following career<br/>
  opportunities:
  <ul>
<li>Salesforce Administrator</li>
<li>Salesforce Developer</li>
<li>Salesforce Technical Architect</li>
<li>Salesforce Business Analyst</li>
<li>Salesforce Marketing Manager</li>
<li>Salesforce Sales Manager</li>
<li>Salesforce Consultant</li>
</ul>
<span className='topic-content-span'>4. Opportunity to work in big companies</span><br/>
All the big companies have Salesforce as a major service practice. The top ten companies with strong Salesforce practice include Accenture, Deloitte, IBM, PwC, Wipro, Cognizant Technologies, Capgemini, NTT Data and Tech Mahindra. 
These companies have huge Salesforce practices and employ thousands of Salesforce Developers, Administrators, Architects etc. They are also hiring Salesforce professionals on a large scale. A Salesforce trained professional gets the opportunity to work in these large companies.<br/>
<span className='topic-content-span'>5. Global Demand</span><br/>
Salesforce is a global company. Salesforce trained professionals are in global demand. They get opportunities to work in different parts of the world including USA, Europe, Australia, Singapore etc.<br/>
<span className='topic-content-span'>6. World’ #1 CRM and growing</span><br/>
Salesforce is the undisputed leader in cloud-based CRM. It is highly in demand and growing at a rapid rate. Many companies are switching from traditional CRM to cloud-based CRM. Salesforce being the market leader becomes their first choice. While traditional CRM is losing market share, the Salesforce market share is increasing consistently.<br/>
<span className='topic-content-span'>7. Digital World</span><br/>
The world is increasingly going digital. Every company is increasing its digital footprint to stay relevant in the market. Companies that do not embrace digital technologies will get left behind. Digital technologies enable companies to reach the global market and showcase their goods and services. Marketing, Sales, and Service with digital technologies enable companies to reach out to customers, understand them and delight them. There will be more and more demand for companies to embrace cloud-based platforms like Salesforce.</p>
        </div>


<div className='salesforce-blog-bottom'>
  <h3>7 Reasons to Learn Salesforce in 2023 By</h3>
  <button className='btn-curriculum'>
          <BsFileEarmarkPdfFill style={{ height: '40px', width: '30px', color: 'red' }} />Download
        </button>
</div>

</div>


    </div>
    <div className='salesforce-entries'>
      <h1>Recent Entries</h1>
 <RecentEntries/>
 </div>
 <Footer/>
 <StickyBar/>
    
    </>
  )
}

export default SalesforceBlog
