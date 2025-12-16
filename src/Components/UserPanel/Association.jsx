import React from 'react';
import './Home.css';
import img1 from '../../Assets/cl1.webp';
import img2 from '../../Assets/cl2.webp';
import img3 from '../../Assets/cl3.webp';
import img4 from '../../Assets/cl4.webp';
import img5 from '../../Assets/cl5.webp';
import img6 from '../../Assets/cl6.webp';
import img7 from '../../Assets/cl7.webp';
import img8 from '../../Assets/cl8.webp';
import img9 from '../../Assets/cl9.webp';
import img10 from '../../Assets/cl10.webp';
import img11 from '../../Assets/cl11.webp';
import img12 from '../../Assets/cl12.webp';

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
