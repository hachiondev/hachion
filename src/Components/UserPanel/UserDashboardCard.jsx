import React from 'react';
import './Dashboard.css';
import DashboardCard from './DashboardCard'; 
import {PiVideoFill} from 'react-icons/pi';
import {FaMoneyBillTrendUp} from 'react-icons/fa6';
import { PiBookOpenTextFill } from 'react-icons/pi';
import { FaUserTimes } from 'react-icons/fa';
import enroll from "../../Assets/dash-icon1.png";
import learn from "../../Assets/dash-icon2.png";
import cert from "../../Assets/dash-icon3.png";
import progress from "../../Assets/dash-icon4.png";
import Learn from "../../Assets/dash-icon5.png";
import assignment from "../../Assets/dash-icon6.png";
import activity from "../../Assets/dash-icon7.png";

const UserDashboardCard = () => {
  const loginuserData = JSON.parse(localStorage.getItem('loginuserData'));
const email = loginuserData?.email || '';
  return (
    <>
    <div className="user-dashboard-heading">
      <h3>Welcome back, {loginuserData?.name || 'User'}! 👋</h3>
      <p>Ready to continue your learning journey today?</p>
      </div>
      <div className='courses-enrolled'>
        <div className="dashboard-card">
        <div className='dashboard-content-cards'>
        <DashboardCard
            img={enroll}
            heading="Enrolled Courses"
            content="0"
            subcontent="+2 This Month"
            subcolor="#5686E1"
          />
       
          <DashboardCard
            img={learn}
            heading="Learning Hours"
            content="0"
            subcontent="0 Completed"
            subcolor="#00AEEF"
          />
           <DashboardCard
            img={cert}
            heading="Certificates"
            content="0"
          />
           <DashboardCard
            img={progress}
            heading="Avg Progress"
            content="0"
            subcontent="Keep Going!"
            subcolor="#0D9101"
          />
        </div>
        </div>
      <div className='dashboard-card-row'>
      <div className='dashboard-user-text'>
      <div className='dashboard-activity'>
        <img src={Learn} alt='Learning' />
        <div className='dashboard-activity-heading'>Continue Learning</div>
      </div>
      <div className='dashboard-activity'>
        <img src={activity} alt='activity' />
        <div className='dashboard-activity-heading'>Recent Activity</div>
      </div>
      </div>
      <div className='dashboard-activity'>
        <img src={assignment} alt='assignment' />
        <div className='dashboard-activity-heading'>Upcoming Assignments</div>
      </div>
      </div>
      </div>
    </>
  );
};

export default UserDashboardCard;