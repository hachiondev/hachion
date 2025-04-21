import React from 'react';
import './Admin.css';
import DashboardCard from './DashboardCard'; 
import {
  FaUserGraduate,
  FaUserTimes,
  FaBriefcase,
  FaUsers
} from 'react-icons/fa';
import {
  FaMoneyBillTrendUp,
  FaFileCircleQuestion
} from 'react-icons/fa6';
import {
  PiVideoFill,
  PiBookOpenTextFill
} from 'react-icons/pi';
import { MdPeopleAlt } from 'react-icons/md';
import { AiFillContacts } from 'react-icons/ai';

const dashboardCards = [
  {
    icon: FaUserGraduate,
    background: "linear-gradient(45deg,#4FACFE,#00F2FE)",
    heading: "3162",
    content: "Students",
  },
  {
    icon: PiVideoFill,
    background: "linear-gradient(45deg,#A445B2,#D41872,#FF0066)",
    heading: "277",
    content: "Live Demo",
  },
  {
    icon: FaMoneyBillTrendUp,
    background: "linear-gradient(45deg,#16A085,#F4D03F)",
    heading: "456",
    content: "Online Revenue",
  },
  {
    icon: PiBookOpenTextFill,
    background: "linear-gradient(45deg,#FF5858 , #F09819)",
    heading: "61",
    content: "Total Courses",
  },
  {
    icon: FaFileCircleQuestion,
    background: "linear-gradient(45deg,#7028E4, #E5B2CA)",
    heading: "8",
    content: "Quick Enquiry",
  },
  {
    icon: MdPeopleAlt,
    background: "linear-gradient(45deg,#FF0844,#FFB199)",
    heading: "3",
    content: "Active Partner",
  },
  {
    icon: FaUserTimes,
    background: "linear-gradient(45deg,#868F96,#596164)",
    heading: "1",
    content: "In-active Partner",
  },
  {
    icon: FaBriefcase,
    background: "linear-gradient(45deg,#3D3393,#2B76B9,#2CACD1,#35EB93)",
    heading: "2",
    content: "Applied jobs",
  },
  {
    icon: FaBriefcase,
    background: "linear-gradient(45deg,#C79081,#DFA579)",
    heading: "9",
    content: "Visa",
  },
  {
    icon: AiFillContacts,
    background: "linear-gradient(45deg,#43E97B,#38F9D7)",
    heading: "2",
    content: "Unique Visitors",
  },
  {
    icon: FaUsers,
    background: "linear-gradient(45deg,#09203F,#537895)",
    heading: "2",
    content: "Total Visitors",
  },
];

const AdminDashboard = () => {
  return (
    <div className='admin-dashboard'>
      <p>Dashboard</p>
      <div className='admin-dashboard-content'>
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            background={card.background}
            heading={card.heading}
            content={card.content}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;