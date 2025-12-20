import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import DashboardCard from './DashboardCard'; 
import enroll from "../../Assets/dash-icon1.webp";
import learn from "../../Assets/dash-icon2.webp";
import cert from "../../Assets/dash-icon3.webp";
import progress from "../../Assets/dash-icon4.webp";
import Learn from "../../Assets/dash-icon5.webp";
import assignment from "../../Assets/dash-icon6.webp";
import activity from "../../Assets/dash-icon7.webp";

const API_BASE = "https://api.hachion.co";


function parseDateFlexible(s) {
  
  if (!s) return null;
  
  const d1 = new Date(s);
  if (!isNaN(d1.getTime())) return d1;

  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m) {
    const [ , y, mo, d, hh = "00", mm = "00", ss = "00" ] = m;
    return new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss)
    );
  }
  return null;
}

function diffInWholeMonths(fromDate, toDate = new Date()) {
  if (!fromDate) return null;
  const fY = fromDate.getFullYear(), fM = fromDate.getMonth();
  const tY = toDate.getFullYear(), tM = toDate.getMonth();
  let months = (tY - fY) * 12 + (tM - fM);
  
  if (toDate.getDate() < fromDate.getDate()) months -= 1;
  return Math.max(months, 0);
}
function timeAgo(fromDate, now = new Date()) {
  if (!fromDate) return null;
  const diffMs = now - fromDate;
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const mon = Math.floor(day / 30);
  const yr = Math.floor(day / 365);

  if (sec < 45) return 'just now';
  if (min < 60) return `${min} ${min === 1 ? 'minute' : 'minutes'} ago`;
  if (hr < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} ago`;
  if (day < 30) return `${day} ${day === 1 ? 'day' : 'days'} ago`;
  if (mon < 12) return `${mon} ${mon === 1 ? 'month' : 'months'} ago`;
  return `${yr} ${yr === 1 ? 'year' : 'years'} ago`;
}

const UserDashboardCard = () => {
  const loginuserData = JSON.parse(localStorage.getItem('loginuserData'));
  const email = loginuserData?.email || '';

const [enrollSummary, setEnrollSummary] = useState({
  totalEnrolled: 0,
  lastEnrollDate: null,
  lastCourseName: null
});
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  useEffect(() => {
    if (!email) return;
    let ignore = false;

    (async () => {
      try {
        setLoadingEnroll(true);
        const res = await fetch(
          `${API_BASE}/summary?email=${encodeURIComponent(email)}`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); 
        if (!ignore) {
          setEnrollSummary({
            totalEnrolled: data?.totalEnrolled ?? 0,
            lastEnrollDate: data?.lastEnrollDate ?? null,
             lastCourseName: data?.lastCourseName ?? null
          });
        }
      } catch (e) {
        console.error('Failed to load enrollment summary', e);
        if (!ignore) setEnrollSummary({ totalEnrolled: 0, lastEnrollDate: null });
      } finally {
        if (!ignore) setLoadingEnroll(false);
      }
    })();

    return () => { ignore = true; };
  }, [email]);

  let subcontent;
  if (!email) {
    subcontent = 'Login to view';
  } else if (!enrollSummary.lastEnrollDate) {
    subcontent = 'No enrollments yet';
  } else {
    const last = parseDateFlexible(enrollSummary.lastEnrollDate);
    const months = last ? diffInWholeMonths(last) : null;
    if (months === null) {
      subcontent = '—';
    } else if (months === 0) {
      subcontent = '+This Month';
    } else if (months === 1) {
      subcontent = '+1 month ago';
    } else {
      subcontent = `+${months} months ago`;
    }
  }
const lastDate = enrollSummary.lastEnrollDate ? new Date(enrollSummary.lastEnrollDate) : null;
const dynamicCourse = enrollSummary.lastCourseName
  ? `No courses enrolled: ${enrollSummary.lastCourseName}`
  : "No courses enrolled";
const dynamicTime = timeAgo(lastDate) || "—";

const recentActivity = [
  { img: enroll, text: dynamicCourse, time: dynamicTime },
  { img: cert, text: "Earned certificate in Web Development", time: "2 hours ago" },
  { img: learn, text: "Submitted JavaScript Basics assignment", time: "1 day ago" },
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

      <div className='courses-enrolled container'>
        <div className="dashboard-card">
          <div className='dashboard-content-cards'>
            <DashboardCard
              img={enroll}
              heading="Enrolled Courses"
              content={loadingEnroll ? '...' : String(enrollSummary.totalEnrolled)}
              subcontent={subcontent}
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
