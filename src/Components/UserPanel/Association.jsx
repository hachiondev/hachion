import React from 'react';
import './Home.css';
import img1 from '../../Assets/image 11.png';
import img2 from '../../Assets/image 12.png';
import img3 from '../../Assets/image 13.png';
import img4 from '../../Assets/image 14.png';
import img5 from '../../Assets/image 15.png';
import img6 from '../../Assets/image 16.png';
import img7 from '../../Assets/image 17.png';
import img8 from '../../Assets/image 18.png';
import img9 from '../../Assets/image 19.png';
import img10 from '../../Assets/image 20.png';
import img11 from '../../Assets/image 21.png';
import img12 from '../../Assets/image 22.png';

const images = [
  img1, img2, img3, img4, img5, img6,
  img7, img8, img9, img10, img11, img12,
];

const Association = () => {
  return (
    <>
      <div className='it-data'>
        <h2 className='it-title'>Trusted by <span> 200+ Leading Companies and Universities</span></h2>
      <div className="it-logos container">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="it-logos-slide">
            {images.map((img, index) => (
              <img key={index} src={img} height="50" width="auto" alt={`image${index + 1}`} />
            ))}
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default Association;
