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
import automation from '../../Assets/automationtesting.png';

const QaTestingBlog = () => {
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
            <img src={automation} alt='salesforce'/>
            <div>
            <h1>Importance of Automation in Software Testing</h1>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <h5><FaUser/>  Srilatha P</h5>
              <h5>105 Views</h5>
              <h5>24-09-10</h5>
           </div>
           </div>
           </div>
       
           <div className='topics'>
            <h2>Overview of Topics</h2>
            <p>1. Manual Testing vs Automation Testing </p>
            <p>2. The Benefits of Test Automation to the QA Team </p>
            <p>3. Business Value that Test Automation Brings </p>
            <p>4. Conclusion  </p>
            

            <p className='topic-content'>Software testing, an elementary part of the improvement process for software applications that meet the<br/>
            <br/>

Central approach of quality, can be a difficult process, to completion the least. With the growing number of <br/>
functionalities that applications today are advanced with, not to notification the great number of platforms <br/>
 and browsers to account for, there is an ever developing possibility of bugs and issues going overlooked. <br/>
 However, the greatly competing market scenario does not allow software developers the affluence of allowing <br/>
  products with even lesser bugs to reach the market, as a brand with issues will be outright rejected.<br/>
  <br/>

In such a scenario, software developers have embraced automation testing to development the ability of the <br/>
testing process and to develop test coverage. The best thing about automation is that it not just improves the<br/>
 quality of testing and makes it different times faster, but also reduces the cost involved<br/>

<br/>
<span className='topic-content-span'>Manual Testing vs Automation Testing</span><br/>

Before we move ahead to determine about the role of automation testing and its importance in the sphere of <br/>
software testing, it’s important to learn the difference between manual and automation testing.<br/>
<br/>


Manual software testing connect a human sitting in front of a computer screen and testing an application by<br/>
 trying out the different combinations of usage and inputs to establish every one of them fetches the desired <br/>
  results when compared to the expected results or attitude that serve as the benchmark.<br/>
  <br/>

Automation testing, on the other hand, involves testing software applications using scripts and tools instead.<br/>
 The use of automated scripts opens up a whole lot of possibilities when it comes to advancing the scope of <br/>
  testing, and this makes automation testing so essential to software development today.<br/>
  <br/>
<br/>

<span className='topic-content-span'>The Benefits of Test Automation to the QA Team</span><br/>


Automation of the software testing process can prove to be beneficial to the Quality Analysis (QA) teams of an organization in several ways, and the key ones are specified below.<br/>

a] Increased Test Coverage<br/>
Automation testing can significantly improve the test coverage because it allows lengthy tests to be covered in less time, thus allowing more tests to be covered under the tight timeframe I which software development teams work today. This is possible not just because of the speed of automation but also the fact that a test automation tool can perform tests unattended, which results in better utilization of time.<br/>

b] Improved Accuracy<br/>
Manual testing does hold the possibility of human errors, even if the most dexterous tester is executing the tests. This scope of errors, no matter how minimal, is completely eliminated with automation testing.<br/>

c] Faster Testing Process<br/>
Automation testing is significantly faster than manual testing, simply because it involves the use of tools and scripts. This increased speed can give an additional advantage to QA teams as it helps them execute tests multiple times with ease, and still meet the deadlines.<br/>

d] Increased Scope of Software Testing<br/>
Automation testing can execute test cases that are impossible to achieve with manual testing. For example, regression testing, which involves executing a test against multiple sets of data or inputs, can turn out to be a mammoth feat for manual testers but can be easily accomplished with automation.<br/>


e] Reusability of Test Cases<br/>
With automation testing, the same set of test cases can be re-used to test different versions of the software and can be upgraded as and when required to incorporate addition of new features and discovery of new bugs. Software testing can get repetitive and an automation testing tool can easily take care of the repetitive steps and at the same time eliminate the risk of human errors.<br/>

f] Earlier Detection of Bugs<br/>
Automation testing makes it possible to detect bugs during the early stages of the software life cycle. While this may seem inconsequential, it can go a long way in saving the time and costs incurred in fixing the bugs later. Whenever there is a change in the source code, the tests can be run automatically to detect any bugs and/or issues. Moreover, the simultaneous running of test cases makes it possible to generate detailed reports for easy comparison.<br/>

<br/>
<span className='topic-content-span'>Business Value that Test Automation Brings </span><br/>

Now that we have learnt about the ways in which automation can interest the QA teams today, let us have a active look at how the effect of automation can benefit the organization.<br/>
a] Improved Quality of Software<br/>
Automation testing increases the quality of software. Several factors like the upgraded test coverage, increased efficiency of testing, and higher levels of accuracy as compared to manual testing, assure that the end product meets the highest quality standards. This is a significant benefit that a business experiences with the implementation of automation testing.<br/>
b] Reduced Cost of Testing<br/>
The earlier bugs are detected in the software development lifecycle, the less expensive it is to fix them. Test automation leads to reduction in the cost of bug fixing as bugs can be detected at an earlier stage as compared to manual testing. This can translate to significant cost-reduction for the organization.<br/>
c] Boost in the Return on Investment (ROI)<br/>
One of the biggest benefits of automation testing for a business is the significant increase in ROI. The initial investment is what makes many businesses think twice before going ahead with test automation. However, with significant increase in efficiency and productivity, automation fetches a high return on investment (ROI) and this has been proven. Automating your test process makes you save on money and time, which translates to increased ROI in the long run.<br/>
d] Faster Time to Market<br/>
Automation saves a lot of time through several features like simultaneous execution of test cases, regression testing, etc. The speed that automation brings to the software testing process results in a faster time to market for the product. This is another reason a business should switch to automation as delivering a product within the stipulated timeframe is what every development team aims for.<br/>
e] Boost in Employee Morale <br/>
Using automation testing to take care of the mundane and repetitive tasks can boost the morale of your testing team as it gives them the time and opportunity to improve their skill sets and work on more challenging assignments. This positive mindset helps them contribute better to the organization.<br/>
<br/>
<span className='topic-content-span'>Conclusion </span><br/>

Automation testing is important because it enables the organization to achieve the goals of testing with ease and at the same time, fetches high ROI that more than compensates for the initial investment. To implement test automation, an organization needs to start with choosing a comprehensive test automation platform like  that provides a short learning curve and a zero coding framework and offers multiple testing functionalities.</p>
        </div>


<div className='salesforce-blog-bottom'>
  <h3>Importance of automation in software testing</h3>
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

export default QaTestingBlog
