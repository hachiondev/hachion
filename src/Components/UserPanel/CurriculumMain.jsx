import React from 'react'
import Curriculum from './Curriculum';

const topics1 = [
  'Course Demo Video Links',
  'Introduction',
  'Selenium IDE',
  'Java',
  'WebDriver Introduction',
  'Add on and Methods'
];
 const topics2=[
  'Profiles',
  'Automating Links',
  'Automating Dropdowns',
  'Xpaths',
  'Using CSS SElectors',
  'TestNG',
  'Tab and Popup Automation',
  'Synchronization',
  'Ajax Testing',
  'Miscellaneous',
  'Action Class',
  'Automating WebTable',
  'Excel Read/Write',
  'Frameworks',
  'Automating Window Components',
  'Version Controlling',
  'Maven',
  'Grid II',
  'Continuous Integration',
  'buddy'
 ]


const CurriculumMain = () => {
  return (
    <>
    <div>
      <Curriculum 
        heading="Curriculum"
        topics={topics1}
        buttonText="Download Curriculum"
        additionalTopics={topics2}
      />
   
    </div>
    
    </>
  )
}

export default CurriculumMain
