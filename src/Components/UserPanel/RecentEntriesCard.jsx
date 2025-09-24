// import React from "react";
// import "./Corporate.css";
// import { HiEye } from "react-icons/hi";
// import Blogimageplaceholder from "../../Assets/Default_blogimage.jpg";
// const RecentEntriesCard = ({ imageSrc, content, views, date, onClick }) => {
//   const handleImageError = (e) => {
//     e.target.src = Blogimageplaceholder;
//   };

//   return (
//     <div className="recent-blog-card" onClick={onClick}>
//       <img
//         src={imageSrc}
//         alt="card-image"
//         className="recent-blog-card-image"
//         onError={handleImageError}
//       />
//       <div className="content-block">
//         <p className="content">{content}</p>
//         <div className="bottom-content">
//           {/* <p className="views">
//             <HiEye className="views-icon" /> {views}
//           </p> */}
//           <p className="blog-author">Swapna</p>
//           <p className="date">{date}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentEntriesCard;

import React from "react";
import "./Corporate.css";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/Default_blogimage.jpg";

const RecentEntriesCard = ({ 
  imageSrc, 
  category, 
  content, 
  description, 
  author, 
  avatarSrc, 
  date, 
  onClick 
}) => {
  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  return (
    <div className="recent-blog-card" onClick={onClick}>
      {/* Blog Image */}
      <img
        src={imageSrc}
        alt="card-image"
        className="recent-blog-card-image"
        onError={handleImageError}
      />

      <div className="content-block">
        {/* Category Badge */}
        {category && <span className="category-badge">{category}</span>}

        {/* Title */}
        <p className="content">{content}</p>

        {/* Description */}
        <p className="blog-card-description">A hacker is someone who finds and exploits weaknesses in systems—these can be computer programs, websites, phones, or even human behavior.</p>

        {/* Author Section */}
        <div className="author-info">
          {avatarSrc ? (
            <div className="avatar-wrapper">
              <img
                src={avatarSrc}
                alt="author-avatar"
                className="author-avatar"
                onError={handleImageError}
              />
              <div className="avatar-fallback">
                <BsPersonCircle size={48} color="#b3b3b3" />
              </div>
            </div>
          ) : (
            <div className="author-avatar avatar-fallback">
              <BsPersonCircle size={48} color="#b3b3b3" />
            </div>
          )}
          <div className="author-details">
            <p className="blog-author">Swapna</p>
            <p className="date">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;
