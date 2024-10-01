import React, { useState } from 'react';
import { RiMenuUnfold3Line } from "react-icons/ri";
import CourseCard from './CourseCard';
import card1 from '../../Assets/image 96.png';
import card2 from '../../Assets/image 85.png';
import card3 from '../../Assets/image 93.png';
import card4 from '../../Assets/image 90.png';
import card5 from '../../Assets/image 80.png';
import card6 from '../../Assets/image 107.png';
import card7 from '../../Assets/image 110.png';
import card8 from '../../Assets/image 95.png';
import { useNavigate } from 'react-router-dom';

const Trending = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownSelection, setDropdownSelection] = useState('Project Management');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Categories and associated cards
  const categories = [
    { name: 'All', cards: [
        { heading: 'Google Cloud', image: card1 },
        { heading: 'AWS Developer', image: card2 },
        { heading: 'Load Runner', image: card3 },
        { heading: 'Python', image: card4 },
        { heading: 'QA Automation', image: card5 },
        { heading: 'Angular JS Training', image: card6 },
        { heading: 'Javascript course', image: card7 },
        { heading: 'QA Manual Testing', image: card8 }
      ]
    },
    { name: 'Cloud Computing', cards: [
        { heading: 'Google Cloud', image: card1 },
        { heading: 'AWS Developer', image: card2 }
      ]
    },
    { name: 'Salesforce', cards: [
        { heading: 'Salesforce', image: card2 }
      ]
    },
    { name: 'Data Science', cards: [
        { heading: 'Python', image: card4 }
      ]
    },
    { name: 'QA Testing', cards: [
        { heading: 'Load Runner', image: card3 },
        { heading: 'QA Automation', image: card5 },
        { heading: 'QA Manual Testing', image: card8 }
      ]
    },
    { name: 'Service Now', cards: [
        { heading: 'Service Now', image: card6 }
      ]
    },
    { name: 'BPM', cards: [
        { heading: 'Javascript course', image: card7 }
      ]
    }
  ];

  const dropdownOptions = [
    'Project Management',
    'Business Intelligence',
    'Programming',
    'Big Data',
    'Workday',
    'Mule Soft',
    'Mobile Development',
    'Machine Learning',
    'Blockchain',
    'Data Warehousing',
    'Deep Learning',
    'Microsoft',
    'Scrum Master'
  ];

  // Filter cards based on the active category or dropdown selection
  const filteredCards = categories.find(category => category.name === activeCategory)?.cards || [];

  const handleDropdownClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownSelection = (selection) => {
    setDropdownSelection(selection);
    setDropdownVisible(false);
  };

  return (
    <>
      <div className='training-events'>
        <div className='training-events-head'>
          <h1 className='association-head'>Trending Courses</h1>
        </div>
        <div className='view-btn'>
          <button className='view-all' onClick={()=>navigate('/course')}>View All</button>
        </div>
        <div className='courses-list'>
          {categories.map(category => (
            <h2
              key={category.name}
              className={`course-names ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
              style={{ cursor: 'pointer' }}
            >
              {category.name}
            </h2>
          ))}
          <div className='dropdown-container'>
            <RiMenuUnfold3Line className='menu-icon'
              style={{ fontSize: '2rem', cursor: 'pointer',marginTop:'1.3vh' }} 
              onClick={handleDropdownClick} 
            />
            {dropdownVisible && (
              <div className='dropdown-list'>
                {dropdownOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className='dropdown-item' 
                    onClick={() => handleDropdownSelection(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='training-card-holder'>
          {filteredCards.map((card, index) => (
            <CourseCard
              key={index}
              heading={card.heading}
              month='3 months'
              time='80 hours'
              image={card.image}
              onClick={() => handleCardClick(`/${card.heading.toLowerCase().replace(/\s+/g, '')}`)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Trending;
