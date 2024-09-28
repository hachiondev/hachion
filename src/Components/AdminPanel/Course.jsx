import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Pagination from '@mui/material/Pagination';
import './Admin.css';
import CourseCategory from './CourseCategory';
import automation from '../../Assets/image 80.png';
import python from '../../Assets/image 90.png';
import profileImage from '../../Assets/Ellipse 18.png';

// Styling the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



// Sample data creation
function createData(S_No, image, course_name, date, action,category_name,schedule_course_name,schedule_date,week,time,duration,title,topics,created_date,faq_title,description,video,video_description,day,mode,trainer,email,permission,junior,middle,senior,student,source,technology,comment) {
  return { S_No, image, course_name, date, action,category_name,schedule_course_name,schedule_date,week,time,duration,title,topics,created_date,faq_title,description,video,video_description,day,mode,trainer,email,permission,junior,middle,senior,student,source,technology,comment };
}

// Example rows for Course Details
const courseDetailsRows = [
    createData(1,<img src={automation} height={50} alt='course'/>,'Qa Automation','25-11-2021',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>),
    createData(2,<img src={python}  height={50} alt='course'/>,'Python','12-03-2022',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(3, <img src={automation}  height={50} alt='course'/>,'Tableau','1-10-2023' ,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(4,<img src={python}  height={50} alt='course'/>,'Big Data Hadoop','11-10-2019',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>  ),
    createData(5,<img src={automation}  height={50} alt='course'/>,'Salesforce Developer','12-8-2021',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(6, <img src={python}  height={50} alt='course'/> ,'Salesforce Admin','01-12-2023' ,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(7, <img src={automation}  height={50} alt='course'/>,'Data Science with Python','18-4-2023', <><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(8, <img src={python}  height={50} alt='course'/>,'Blue Prism','12-1-2021' ,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(9,<img src={automation}  height={50} alt='course'/>,'Load Runner','11-1-2022',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
    createData(10, <img src={python}  height={50} alt='course'/>,'Service now','13-10-2023' ,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></> ),
];
// Example rows for Schedule
const scheduleRows = [
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation', 'July 09 2024','Tuesday','07:30 PM','1 Hour',null,null,'2024-07-05',null,null,null,null,'Live Demo','Saba'),
    createData(2,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation', 'July 19 2024','Friday','10:30 PM','1 Hour',null,null,'2024-07-18',null,null,null,null,'Live Class','Navya' ),
    createData(3, null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Data Science','Python', 'July 23 2024','Monday','07:30 PM','1 Hour',null,null,'2024-07-20',null,null,null,null,'Live Demo','Navya' )
];

// Add rows for other categories as needed
const curriculumRows =  [
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,'Introduction','What is Automation testing?When to start Automation?When not to go for Automation?<br/>What are the advantages of Automation testing?<br/>What is Selenium?<br/>What are the advantages of Selenium?<br/>Difference between Selenium and QTP?','25-11-2024'),
    createData(2,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,'Selenium','What is Selenium IDE?<br/>Installing IDE<br/>Record and playback<br/>Converting Selenium script into other languages<br/>Batch testing in IDE','12-03-2024'),
    createData(3,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null, 'Java','Introduction to Java,Installing JDK,Configuring Eclipse IDE,Creating Java project,Sample Java program,Classes and objects,Downloading Selenium server jar,Configuring Selenium into the Java project,Conditional Statements in Java,Loops in Java,Arrays in Java,Array List in Java,Methods in Java,Utility functions in Java,Local and global variables in Java,Static and instance variables in Java,Hash set in Java,Method overloading in Java,Constructors in Java,Inheritance in Java,Interfaces in Java,Packages in Java','1-10-2024'  ),
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,'Introduction','What is Automation testing?When to start Automation?When not to go for Automation?<br/>What are the advantages of Automation testing?<br/>What is Selenium?<br/>What are the advantages of Selenium?<br/>Difference between Selenium and QTP?','25-11-2024'),
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,'Introduction','What is Automation testing?When to start Automation?When not to go for Automation?<br/>What are the advantages of Automation testing?<br/>What is Selenium?<br/>What are the advantages of Selenium?<br/>Difference between Selenium and QTP?','25-11-2024')
  ]; // Add data here
const faqRows =  [
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,'25-11-2021','What is Selenium 1.0 and Selenium 2.0?','Selenium 1.0 is also known as Selenium RC, and Selenium 2.0 is also known as Selenium Webdriver. Selenium RC is an approach where a browser is automated by injecting a javascript and commands are driven by sending them to a server. Whereas in the Webdriver the browser API is extended to drive the browser.'),
    createData(2,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,'25-12-2024','Why do we need webdriver when we have IDE available?','Selenium IDE is only an XPI package or adds on of firefox. It was created for the sole purpose of providing record and replay of selenium test scenarios so that test automation script generation using client drivers becomes much faster as IDE also allows one to save a test in other formats. Also, you cannot perform logical flows, parameterization and other such limitations exist with IDE.','12-03-2022' ),
    createData(3,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,'25-01-2023','	What all browsers are supported by Webdriver?','Internet explorer, firefox, safari, chrome, and opera are supported by web driver.'),
    
];// Add data here
const demoVideoRows =  [
    createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation',null,null,null,'1 hour',null,null,'2024-07-05',null,null,'Video Link','Qa Automation session'  ),
    createData(2,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Salesforce','Salesforce Admin',null,null,null,'1 hour',null,null,'2023-08-07',null,null,'Video Link','Salesforce'  ),
    createData(3,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Cloud Computing','AWS Solution Architecture',null,null,null,'1 hour',null,null,'2024-01-10',null,null,'Video Link','AWS (Amazon Web Services) is a comprehensive, evol	'  ),
    createData(4,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Blockchain','Blockchain',null,null,null,'1 hour',null,null,'2024-08-07',null,null,'Video Link','Blockchain'  )
];// Add data here
const regularVideoRows =  [
  createData(1,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation',null,'Week 1',null,'3 hour',null,null,'2024-07-05',null,null,'Video Link','Qa Automation session','Day 1'  ),
  createData(2,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Salesforce','Salesforce Admin',null,'Week 1',null,'2 hour',null,null,'2023-11-9',null,null,'Video Link','Salesforce','Day 1'  ),
  createData(3,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Cloud Computing','AWS Solution Architecture',null,'Week 1',null,'4 hour',null,null,'2024-08-06',null,null,'Video Link','AWS (Amazon Web Services) is a comprehensive, evol	' ,'Day 1' ),
  createData(4,null,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Blockchain','Blockchain',null,'Week 1',null,'4 hour',null,null,'2024-09-08',null,null,'Video Link','Blockchain','Day 1'  )
];
const videoAccessRows =  [
  createData(1,null,null,'2024-05-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation',null,null,null,null,null,null,null,null,'Qa Testing',null,null,null,null,null,'vikashachion@gmail.com','Enable'  ),
  createData(2,null,null,'2024-05-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Salesforce','Qa Salesforce Admin',null,null,null,null,null,null,null,null,'Salesforce',null,null,null,null,null,'vikashachion@gmail.com','Enable'  ),
  createData(3,null,null,'2024-05-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Cloud Computing','AWS Solution Architecture',null,null,null,null,null,null,null,null,'Cloud Computing',null,null,null,null,null,'vikashachion@gmail.com','Enable'  ),
]; // Add data here
const resumeRows =  [
  createData(1,null,null,'2024-05-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Qa Testing','Qa Automation',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Resume','Resume','Resume'),
  createData(2,null,null,'2024-05-15',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Salesforce','Salesforce Admin',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Resume','Resume','Resume'),
  createData(3,null,null,'2024-05-11',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Cloud Computing','AWS Architecture solution',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Resume','Resume','Resume'),
  createData(1,null,null,'2024-05-05',<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,'Blockchain','Blockchain',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Resume','Resume','Resume')
   
];// Add data here
const reviewRows =  [
    createData(1,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Dhananjay','Linkedin','Android App Developer','Hachion is a great place for fresher’s can learn good communication skills and subjects in this institute and they will place you according to your talent.'),
    createData(2,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Henry Lee','Twitter','IOS App Developer','The best training and placement institute that I came across, created a good platform for achieving my dream as an IOS developer.'),
    createData(3,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'John Doe','Facebook','Web Developer','Excellent learning experience, great instructors, and fantastic career support.'),
    createData(4,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Jane Smith','Instagram','Data Scientist','The training was comprehensive and the placement support was exceptional.'),
    createData(5,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Dhananjay','Linkedin','web Developer','Excellent learning experience, great instructors, and fantastic career support.'),
    createData(6,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Henry Lee','Linkedin','IOS App Developer','The training was comprehensive and the placement support was exceptional.'),
    createData(7,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Dhananjay','Linkedin','Android App Developer','Excellent learning experience, great instructors, and fantastic career support.'),
    createData(8,<img src={profileImage} alt='profile-pic'/>,null,null,<><FaEdit className='edit' /> <RiDeleteBin6Line className='delete' /></>,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'Jane Smith','Instagram','Android App Developer','The training was comprehensive and the placement support was exceptional.'),

]; // Add data here

export default function Course() {
  const [activeTab, setActiveTab] = useState('courseDetails'); // Default tab is Course Details

  const tableHeadings = {
    courseDetails: ['S.No', 'Image', 'Course Name', 'Date', 'Action'],
    schedule: ['S.No', 'Category Name', 'Schedule Course Name', 'Schedule Date', 'Week', 'Time', 'Duration','Mode','Trainer','Created Date','Action'],
    curriculum: ['S.No', 'Title', 'Topics', 'Created Date', 'Action'],
    faq: ['S.No', 'FAQ Title', 'Description', 'Created Date', 'Action'],
    demoVideos: ['S.No', 'Category Name', 'Course Name', 'Video', 'Description','Duration','Created Date','Action'],
    regularVideos: ['S.No', 'Category Name', 'Course Name', 'Video', 'Description','Week','Day','Duration','Created Date','Action'],
    videoAccess: ['S.No', 'Category Name', 'Course Name','User Email','Description','Permission' ,'Created Date','Action'],
    resume: ['S.No', 'Image', 'Course Name','Junior Level Position Link','Middle Level Position Link','Senior Level Position Link', 'Date', 'Action'],
    review: ['S.No', 'Images', 'Student Name', 'Source', 'Technology','Comment','Action'],
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Define a function to return the correct data based on the active tab
  const getCurrentRows = () => {
    switch (activeTab) {
      case 'courseDetails': return courseDetailsRows;
      case 'schedule': return scheduleRows;
      case 'curriculum': return curriculumRows;
      case 'faq': return faqRows;
      case 'demoVideos': return demoVideoRows;
      case 'regularVideos': return regularVideoRows;
      case 'videoAccess': return videoAccessRows;
      case 'resume': return resumeRows;
      case 'review': return reviewRows;
      default: return [];
    }
  };

  return (
    <>   
      <div className="certificate-tabs">
        {/* Tab Navigation */}
        <div 
          className={`tab-item ${activeTab === 'courseDetails' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseDetails')}
        >
          Course Details
        </div>
        <div 
          className={`tab-item ${activeTab === 'schedule' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('schedule')}
        >
          Schedule
        </div>
        <div 
          className={`tab-item ${activeTab === 'curriculum' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('curriculum')}
        >
          Curriculum
        </div>
        <div 
          className={`tab-item ${activeTab === 'faq' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('faq')}
        >
          FAQ
        </div>
        <div 
          className={`tab-item ${activeTab === 'demoVideos' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('demoVideos')}
        >
          Demo Videos
        </div>
        <div 
          className={`tab-item ${activeTab === 'regularVideos' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('regularVideos')}
        >
          Regular Videos
        </div>
        <div 
          className={`tab-item ${activeTab === 'videoAccess' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('videoAccess')}
        >
          Video Access
        </div>
        <div 
          className={`tab-item ${activeTab === 'resume' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('resume')}
        >
          Resume
        </div>
        <div 
          className={`tab-item ${activeTab === 'review' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('review')}
        >
          Review
        </div>
      </div>

      <CourseCategory
        pageTitle="Course"
        headerTitle={activeTab.replace(/([A-Z])/g, ' $1')} // Dynamically updates the header title
        buttonLabel={`Add ${activeTab.replace(/([A-Z])/g, ' $1')}`} // Dynamic button label
        onAdd={() => {
          console.log(`Navigating to Add ${activeTab} Page`);
        }}
      />

      {/* Table Content */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
          <TableRow>
    {tableHeadings[activeTab].map((heading, index) => (
      <StyledTableCell key={index}>{heading}</StyledTableCell>
    ))}
  </TableRow>
          </TableHead>
          <TableBody>
          {getCurrentRows().map((row, index) => (
    <StyledTableRow key={index}>
      {/* Render the correct cells based on the active tab */}
      <StyledTableCell>{row.S_No}</StyledTableCell>
      {activeTab === 'courseDetails' && (
        <>
          <StyledTableCell>{row.image}</StyledTableCell>
          <StyledTableCell>{row.course_name}</StyledTableCell>
          <StyledTableCell>{row.date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
      {activeTab === 'schedule' && (
        <>
          <StyledTableCell>{row.category_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_course_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_date}</StyledTableCell>
          <StyledTableCell>{row.week}</StyledTableCell>
          <StyledTableCell>{row.time}</StyledTableCell>
          <StyledTableCell>{row.duration}</StyledTableCell>
          <StyledTableCell>{row.mode}</StyledTableCell>
          <StyledTableCell>{row.trainer}</StyledTableCell>
          <StyledTableCell>{row.created_date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
      {activeTab === 'curriculum' && (
        <>
          <StyledTableCell>{row.title}</StyledTableCell>
          <StyledTableCell>{row.topics}</StyledTableCell>
          <StyledTableCell>{row.created_date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
      {activeTab === 'faq' && (
        <>
          <StyledTableCell>{row.faq_title}</StyledTableCell>
          <StyledTableCell>{row.description}</StyledTableCell>
          <StyledTableCell>{row.created_date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
          {activeTab === 'demoVideos' && (
        <>
          <StyledTableCell>{row.category_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_course_name}</StyledTableCell>
          <StyledTableCell>{row.video}</StyledTableCell>
          <StyledTableCell>{row.video_description}</StyledTableCell>
          <StyledTableCell>{row.duration}</StyledTableCell>
          <StyledTableCell>{row.created_date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
           {activeTab === 'regularVideos' && (
        <>
          <StyledTableCell>{row.category_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_course_name}</StyledTableCell>
          <StyledTableCell>{row.video}</StyledTableCell>
          <StyledTableCell>{row.video_description}</StyledTableCell>
          <StyledTableCell>{row.week}</StyledTableCell>
          <StyledTableCell>{row.day}</StyledTableCell>
          <StyledTableCell>{row.duration}</StyledTableCell>
          <StyledTableCell>{row.created_date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
      {activeTab === 'videoAccess' && (
        <>
          <StyledTableCell>{row.category_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_course_name}</StyledTableCell>
          <StyledTableCell>{row.email}</StyledTableCell>
          <StyledTableCell>{row.description}</StyledTableCell>
          <StyledTableCell>{row.permission}</StyledTableCell>
          <StyledTableCell>{row.date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
      {activeTab === 'resume' && (
        <>
          <StyledTableCell>{row.category_name}</StyledTableCell>
          <StyledTableCell>{row.schedule_course_name}</StyledTableCell>
          <StyledTableCell>{row.junior}</StyledTableCell>
          <StyledTableCell>{row.middle}</StyledTableCell>
          <StyledTableCell>{row.senior}</StyledTableCell>
          <StyledTableCell>{row.date}</StyledTableCell>
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
        {activeTab === 'review' && (
        <>
          <StyledTableCell>{row.image}</StyledTableCell>
          <StyledTableCell>{row.student}</StyledTableCell>
          <StyledTableCell>{row.source}</StyledTableCell>
          <StyledTableCell>{row.technology}</StyledTableCell>
          <StyledTableCell>{row.comment}</StyledTableCell>
      
          <StyledTableCell>{row.action}</StyledTableCell>
        </>
      )}
     
    </StyledTableRow>
  ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className='pagination'>
        <Pagination count={10} color="primary" />
      </div>
    </>
  );
}
