import React from 'react';
import './Corporate.css';
// import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { MdOutlineStar } from "react-icons/md";
import Avatar from '@mui/material/Avatar';

// Import social media icons
import linkedin from '../../Assets/linkedin.png';
import facebook from '../../Assets/facebook.png';
import instagram from '../../Assets/instagram.png';
import twitter from '../../Assets/twitter.png';

const LearnerCard = (props) => {
  // Determine which social media logo to display
  const getSocialMediaLogo = (social_id) => {
    switch (social_id) {
      case 'Facebook':
        return facebook;
      case 'Instagram':
        return instagram;
      case 'Twitter':
        return twitter;
      case 'Linkedin':
        return linkedin
      default:
        return linkedin;
    }
  };

  // Generate star ratings based on the `rating` prop
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MdOutlineStar
          key={i}
          className={`star-icon ${i <= rating ? 'filled-star' : 'empty-star'}`} // Add conditional class for styling
        />
      );
    }
    return stars;
  };

  return (
    <div className='learner-card'>
      <div className='learner-top'>
        <div className='learner-image'>
          <Avatar alt={props.name} src={props.image || ''} className='profile-image' />
        </div>
        <div className='learner-info'>
          <div className='learner-name'>
            <p className='name'>{props.name}</p>
            <img src={getSocialMediaLogo(props.social_id)} alt={props.social_id} />
          </div>
          <p className='job-profile'>{props.profile}</p>
          <p className='job-location'>{props.location}</p>
          <div className='rating'>{renderStarRating(props.rating)}</div>
        </div>
      </div>
      <div className='learner-description-bottom'>
        {/* <span className='quotesleft-icon'>
          <ImQuotesLeft />
        </span> */}
        <p className='learner-description'>
          {props.content}
        </p>
        {/* <span className='quotesright-icon'>
          <ImQuotesRight />
        </span> */}
      </div>
    </div>
  );
};

export default LearnerCard;