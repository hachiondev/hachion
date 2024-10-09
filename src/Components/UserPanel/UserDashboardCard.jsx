import React from 'react';
import '../AdminPanel/Admin.css';
import DashboardCard from '../AdminPanel/DashboardCard'; 
import {PiVideoFill} from 'react-icons/pi';
import {FaMoneyBillTrendUp} from 'react-icons/fa6';
import { PiBookOpenTextFill } from 'react-icons/pi';
import { FaUserTimes } from 'react-icons/fa';

const UserDashboardCard = () => {
  return (
    <>
      <div className='courses-enrolled'>
        <h6>Dashboard</h6>
        <div className='admin-dashboard-content'>
        <DashboardCard
            icon={FaUserTimes}
            background="linear-gradient(45deg,#868F96,#596164)"
            heading="1"
            content="In-active Partner"
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
        
        </div>
      </div>
    </>
  );
};

export default UserDashboardCard;
