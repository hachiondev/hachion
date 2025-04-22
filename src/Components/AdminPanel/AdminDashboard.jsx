import React from 'react';
import './Admin.css';
import { FaUserGraduate } from 'react-icons/fa';
import DashboardCard from './DashboardCard'; 
import {PiVideoFill} from 'react-icons/pi';
import {FaMoneyBillTrendUp} from 'react-icons/fa6';
import { PiBookOpenTextFill } from 'react-icons/pi';
import { FaFileCircleQuestion } from 'react-icons/fa6';
import {MdPeopleAlt} from 'react-icons/md';
import { FaUserTimes } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';

import {AiFillContacts} from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <>
      <div className='admin-dashboard'>
        <p>Dashboard</p>
        <div className='admin-dashboard-content'>
          <DashboardCard
            icon={FaUserGraduate}
            background="linear-gradient(45deg,#4FACFE,#00F2FE)"
            heading="3162"
            content="Students"
          />
          <DashboardCard
            icon={PiVideoFill}
            background="linear-gradient(45deg,#A445B2,#D41872,#FF0066)"
            heading="277"
            content="Live Demo"
          />
           <DashboardCard
            icon={FaMoneyBillTrendUp}
            background="linear-gradient(45deg,#16A085,#F4D03F)"
            heading="456"
            content="Online Revenue"
          />
           <DashboardCard
            icon={PiBookOpenTextFill
            }
            background="linear-gradient(45deg,#FF5858 , #F09819)"
            heading="61"
            content="Total Courses"
          />
           <DashboardCard
            icon={FaFileCircleQuestion}
            background="linear-gradient(45deg,#7028E4, #E5B2CA)"
            heading="8"
            content="Quick Enquiry"
          />
           <DashboardCard
            icon={MdPeopleAlt}
            background="linear-gradient(45deg,#FF0844,#FFB199)"
            heading="3"
            content="Active Partner"
          />
           <DashboardCard
            icon={FaUserTimes}
            background="linear-gradient(45deg,#868F96,#596164)"
            heading="1"
            content="In-active Partner"
          />
           <DashboardCard
            icon={FaBriefcase}
            background="linear-gradient(45deg,#3D3393,#2B76B9,#2CACD1,#35EB93)"
            heading="2"
            content="Applied jobs"
          />
           <DashboardCard
            icon={FaBriefcase}
            background="linear-gradient(45deg,#C79081,#DFA579)"
            heading="9"
            content="Visa"
          />
           <DashboardCard
            icon={AiFillContacts}
            background="linear-gradient(45deg,#43E97B,#38F9D7)"
            heading="2"
            content="Unique Visitors"
          />
           <DashboardCard
            icon={FaUsers}
            background="linear-gradient(45deg,#09203F,#537895)"
            heading="2"
            content="Total Visitors"
          />
        
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
