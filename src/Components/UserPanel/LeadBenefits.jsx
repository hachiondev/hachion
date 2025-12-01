import React from 'react';
import './Home.css';
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { PiCertificate } from "react-icons/pi";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { MdOutlineSupportAgent } from "react-icons/md";

const benefitsData = [
  {
    icon: <LiaHandsHelpingSolid />,
    title: 'Guaranteed Placement Assistance',
    content: 'Get 1:1 career support with resume reviews, mock interviews, and direct job referrals to top tech companies.',
  },
  {
    icon: <PiCertificate />,
    title: 'Industry-Recognized Certification',
    content: 'Earn globally valid certificates upon course completion, endorsed by industry leaders and hiring partners..',
  },
  {
    icon: <HiOutlineDocumentChartBar />,
    title: 'Hands-On Project Experience',
    content: 'Build job-ready skills with real-world projects, case studies, and daily assignments mirroring actual workplace tasks.',
  },
  {
    icon: <MdOutlineSupportAgent />,
    title: 'Learn from Top Mentors',
    content: 'Train under expert instructors from Fortune 500 companies, gaining insider insights and practical knowledge.',
  },
];

const Benefits = () => {
  return (
    <>
        <h2 className='summer-title'>Benefits</h2>
      <div className='career-div'>
        {benefitsData.map((item, index) => (
          <div key={index} className='lead-benefits'>
            <div className='lead-icons' >{item.icon} </div>
            <h3 className='Live-online'>{item.title}</h3>
            <p className='training-content'>{item.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Benefits;
