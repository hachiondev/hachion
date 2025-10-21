import React from 'react';
import img1 from '../../Assets/corporate-icon1.png';
import img2 from '../../Assets/corporate-icon2.png';
import img3 from '../../Assets/corporate-icon3.png';
import './Corporate.css';

const trainingOptions = [
  {
    img: img1,
    alt: 'Corporate Learning',
    text: 'Corporate Learning Without Boundaries',
    label: 'Engage your workforce with live, interactive online training sessions designed to connect global teams, break down barriers, and accelerate business performance.'
  },
  {
    img: img2,
    alt: 'Learn by Doing',
    text: 'Learn by Doing',
    label: 'Turn theory into practice with real-world projects, case studies, and immersive hands-on training that boost skill retention and workplace impact.'
  },
   {
    img: img3,
    alt: 'Complete Learning',
    text: 'Complete Learning Assistance',
    label: 'From onboarding to course completion, our 24/7 learner support ensures every employee receives guidance, motivation, and resources for guaranteed success.'
  }
];
const TrainingOptions = ({ img, text, label, alt }) => (
  <div className='customize-training-card'>
    <img src={img} alt={alt} />
    <div className='expert-online-title'>{text}</div>
    <p className='expert-online-lable'>{label}</p>
  </div>
);

const CorporateTrainingFeature = () => {
  return (
    <>
      <div className="instructor-banner container">
        <h2 className="become-expert-title">Empowering Teams with Innovative Online Corporate Training Solutions</h2>
        <p className="home-title-text">
         Hachion offers<span> world-class corporate training and upskilling programs with an impressive 80% completion rate.</span> Our platform combines interactive learning, hands-on practice, and advanced technology to build a future-ready workforce 
        </p>
      <div className='customize-training'>
        {trainingOptions.map((option, index) => (
          <TrainingOptions key={index} {...option} />
        ))}
      </div>
      </div>
    </>
  );
};

export default CorporateTrainingFeature;
