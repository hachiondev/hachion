// import React from 'react';
// import './Corporate.css';
// // import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
// import { MdOutlineStar } from "react-icons/md";
// import Avatar from '@mui/material/Avatar';

// // Import social media icons
// import linkedin from '../../Assets/linkedin.png';
// import facebook from '../../Assets/facebook.png';
// import instagram from '../../Assets/instagram.png';
// import twitter from '../../Assets/twitter.png';

// const LearnerCard = (props) => {
//   // Determine which social media logo to display
//   const getSocialMediaLogo = (social_id) => {
//     switch (social_id) {
//       case 'Facebook':
//         return facebook;
//       case 'Instagram':
//         return instagram;
//       case 'Twitter':
//         return twitter;
//       case 'Linkedin':
//         return linkedin
//       default:
//         return linkedin;
//     }
//   };

//   // Generate star ratings based on the `rating` prop
//   const renderStarRating = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <MdOutlineStar
//           key={i}
//           className={`star-icon ${i <= rating ? 'filled-star' : 'empty-star'}`} // Add conditional class for styling
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className='learner-card'>
//       <div className='learner-top'>
//         <div className='learner-image'>
//           <Avatar alt={props.name} src={props.profileImage || ''} className='profile-image' />
//         </div>
//         <div className='learner-info'>
//           <div className='learner-name'>
//             <p className='name'>{props.name}</p>
//             <img src={getSocialMediaLogo(props.social_id)} alt={props.social_id} />
//           </div>
//           <p className='job-profile'>{props.profile}</p>
//           <p className='job-location'>{props.location}</p>
//           <div className='rating'>{renderStarRating(props.rating)}</div>
//         </div>
//       </div>
//       <div className='learner-description-bottom'>
//         {/* <span className='quotesleft-icon'>
//           <ImQuotesLeft />
//         </span> */}
//         <p className='learner-description'>
//           {props.content}...<span style={{color: '#00aeef'}}>Read More</span>
//         </p>
//         {/* <span className='quotesright-icon'>
//           <ImQuotesRight />
//         </span> */}
//       </div>
//     </div>
//   );
// };

// export default LearnerCard;

import React, { useState } from 'react';
import './Corporate.css';
import { MdOutlineStar } from "react-icons/md";
import Avatar from '@mui/material/Avatar';
import linkedin from '../../Assets/linkedin.png';
import facebook from '../../Assets/facebook.png';
import instagram from '../../Assets/instagram.png';
import twitter from '../../Assets/twitter.png';
import google from '../../Assets/google.png';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Social Media Icon Selection
const getSocialMediaLogo = (social_id) => {
  switch (social_id) {
    case 'Facebook': return facebook;
    case 'Instagram': return instagram;
    case 'Twitter': return twitter;
    case 'Linkedin': return linkedin;
    case 'Google': return google;
    default: return null;
  }
};

// Star Ratings
const renderStarRating = (rating) => {
  return [...Array(5)].map((_, i) => (
    <MdOutlineStar
      key={i}
      className={`star-icon ${i < rating ? 'filled-star' : 'empty-star'}`}
    />
  ));
};

const LearnerCard = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='learner-card'>
        <div className='learner-top'>
          <div className='learner-image'>
            <Avatar alt={props.name} src={props.profileImage || ''} className='profile-image' />
          </div>
          <div className='learner-info'>
            <div className='learner-name'>
              <p className='name'>{props.name}</p>
              {props.social_id && getSocialMediaLogo(props.social_id) && (
            <img src={getSocialMediaLogo(props.social_id)} alt={props.social_id} />
                )}
            </div>
            <p className='job-profile'>{props.profile}</p>
            <p className='job-location'>{props.location}</p>
            <div className='rating'>{renderStarRating(props.rating)}</div>
          </div>
        </div>
        <div className='learner-description-bottom'>
          <p className='learner-description'>
          {props.content ? props.content.substring(0, 150) : ''}...
          <span className='read-more' onClick={() => setOpen(true)}> Read More</span>
          </p>
        </div>
      </div>

      {/* Modal Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className='top'>
          {props.name}'s Review
          <IconButton aria-label="close" onClick={() => setOpen(false)} className='close-button'>
            <CloseIcon style={{color: '#FFFFFF', background: '#00AEEF', borderRadius: '50%'}}/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='popup-content'>
          <div className='learner-image'>
            <Avatar alt={props.name} src={props.profileImage || ''} className='profile-image' />
            </div>
            <div className='learner-name'>
            <p className='name'>{props.name}</p>
              {props.social_id && getSocialMediaLogo(props.social_id) && (
            <img src={getSocialMediaLogo(props.social_id)} alt={props.social_id} />
                )}
                </div>
            <p className='job-profile'>{props.profile}</p>
            <p className='job-location'>{props.location}</p>
            <div className='rating'>{renderStarRating(props.rating)}</div>
            <p className='full-review'>{props.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LearnerCard;