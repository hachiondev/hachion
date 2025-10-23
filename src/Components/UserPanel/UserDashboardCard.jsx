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

const recentActivity = [
    { img: cert, text: "Earned certificate in Web Development", time: "2 hours ago" },
    { img: learn, text: "Submitted JavaScript Basics assignment", time: "1 day ago" },
    { img: enroll, text: "Started new course: React Masterclass", time: "2 hours ago" },
    { img: progress, text: "Reached 75% progress in Python course", time: "3 days ago" },
  ];

  const upcomingAssignments = [
    { title: "React Project Final Submission", course: "Advanced React", urgency: "High", due: "Due in 2 days" },
    { title: "Design System Case Study", course: "UI/UX Design", urgency: "Medium", due: "Due in 5 days" },
    { title: "Database Schema Design", course: "Full Stack Dev", urgency: "Low", due: "Due in 1 week" },
    { title: "React Project Final Submission", course: "Advanced React", urgency: "High", due: "Due in 2 days" },
  ];
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
      <div className='dashboard-activity-row'>
          {/* Left column */}
          <div className='dashboard-activity-column'>
            {/* Continue Learning */}
            <div className='dashboard-activity'>
              <div className='dashboard-activity-title'>
              <img src={Learn} alt='Learning' />
              <div className='dashboard-activity-heading'>Continue Learning</div>
            </div>
            </div>

            {/* Recent Activity */}
            <div className='dashboard-activity recent-activity'>
              <div className='dashboard-activity-title'>
              <img src={activity} alt='activity' />
              <div className='dashboard-activity-heading'>Recent Activity</div>
              </div>
              <ul className='activity-list'>
                {recentActivity.map((item, index) => (
                  <li key={index}>
                  <div className='dashboard-activity-title'>
                    <img src={item.img} alt='activity icon' className='activity-icon' />
                    <div className='activity-info'>
                    <p className='activity-text'>{item.text}</p>
                    <span className='activity-time'>{item.time}</span>
                  </div>
                  </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Right column */}
          <div className='dashboard-assignment'>
              <div className='dashboard-activity-title'>
            <img src={assignment} alt='assignment' />
            <div className='dashboard-activity-heading'>Upcoming Assignments</div>
            </div>
            <ul className='assignment-list'>
              {upcomingAssignments.map((task, index) => (
                <li key={index} className={`urgency-${task.urgency.toLowerCase()}`}>
                  <p className='assignment-title'>{task.title}</p>
                  <p className='assignment-course'>{task.course}</p>
                  <p className='assignment-due'>
                    <span className='urgency'>{task.urgency}</span> – {task.due}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardCard;