import React from 'react';
import './Corporate.css';
import icon1 from '../../Assets/cc-icon1.webp';
import icon2 from '../../Assets/cc-icon2.webp';
import icon3 from '../../Assets/cc-icon3.webp';
import icon4 from '../../Assets/cc-icon4.webp';
import icon5 from '../../Assets/cc-icon5.webp';
import icon6 from '../../Assets/cc-icon6.webp';
import training from '../../Assets/corporate2.webp';

const features = [
  {
    icon: icon1,
    heading: 'Curated Learning',
    para: 'Handpicked content for your team’s success.',
  },
  {
    icon: icon2,
    heading: '24x7 Support',
    para: 'Assistance anytime, anywhere',
  },
  {
    icon: icon3,
    heading: 'Projects',
    para: 'Learn by doing with industry-focused tasks',
  },
  {
    icon: icon4,
    heading: 'Flexibility',
    para: 'Training that adapts to your schedule',
  },
  {
    icon: icon5,
    heading: 'Skill Tracking',
    para: 'Measure growth, boost performance',
  },
  {
    icon: icon6,
    heading: 'Certification',
    para: 'Validate skills, advance careers',
  },
];

const CustomizeTraining = () => {
  return (
    <>
      <div className="help-background">
        <div className="instructor-banner container">
         <div className="home-content">
        <h2 className="become-expert-title">Customized Corporate Training for Every Team</h2>
        <p className="home-title-text">
         Tailored online IT training solutions designed to fit your workforce needs — flexible, practical, and impact-driven
        </p>
      
        <div className='customized-column'>
          {features.map((item, index) => (
            <div className='customized-content' key={index}>
              <img src={item.icon} alt={`${item.heading}-icon`} loading="lazy"/>
              <div>
                <p className='customized-content-heading'>{item.heading}</p>
                <p className='customized-content-para'>{item.para}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="home-content">
        <img src={training} alt='customized-training' className='key-image' fetchpriority="high"/>
      </div>
      </div>
      </div>
    </>
  );
};

export default CustomizeTraining;
