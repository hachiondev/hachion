<<<<<<< HEAD
=======
// import React from 'react';
// import './Course.css';
// import { FaCircle } from "react-icons/fa";
// import LiveOnlineFeesRight from './LiveOnlineFeesRight';

// export const LiveOnlineFees = () => {
//   return (
//     <>
//       <div className='batch-schedule'>
//         <div className='left'>
//           {/* First batch */}
//           <div className='partition'>
//           <label>
//   <input type="radio" name="radio" />
//   <span className="custom-radio"></span>
//               <div className='partition-schedule'>
//                 <p className='batch-date'>Aug 8 2024 <span className='date-span'>(Thursday)</span></p>
//                 <p className='batch-date'>09:00 PM IST <span className='date-span'>(1 hour)</span></p>
//                 <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
//               </div>
//             </label>
//           </div>


//           {/* Second batch */}
//           <div className='partition'>
//             <label>
             
//               <span className='custom-radio'></span>
//               <div className='partition-schedule'>
//                 <p className='batch-date'>Sep 1 2024 <span className='date-span'>(Sunday)</span></p>
//                 <p className='batch-date'>07:00 PM IST <span className='date-span'>(1 hour)</span></p>
//                 <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
//               </div>
//             </label>
//           </div>

        

//           {/* Third batch */}
//           <div className='partition'>
//             <label>
             
//               <span className='custom-radio'></span>
//               <div className='partition-schedule'>
//                 <p className='batch-date'>Oct 5 2024 <span className='date-span'>(Saturday)</span></p>
//                 <p className='batch-date'>05:00 PM IST <span className='date-span'>(1 hour)</span></p>
//                 <p className='demo'><FaCircle style={{ marginRight:'1vh', height:'20px', width:'20px' }}/>Live Demo</p>
//               </div>
//             </label>
//           </div>
//         </div>
//         <div className='separator'></div>
//         <LiveOnlineFeesRight fee="Free" enrollText="Enroll Now" />
//       </div>
//     </>
//   );
// };

// export default LiveOnlineFees;

>>>>>>> b3cb04845df15ddb26d494293bc9ded49ae1e256
import React, { useState } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

export const LiveOnlineFees = () => {
<<<<<<< HEAD
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (event) => {
    setSelectedDate(event.target.value);
=======
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
>>>>>>> b3cb04845df15ddb26d494293bc9ded49ae1e256
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
<<<<<<< HEAD
          <FormControl>
            <RadioGroup
              aria-labelledby="batch-selection-radio-group"
              name="batch-selection"
              value={selectedDate}
              onChange={handleChange}
            >
              {/* First batch */}
              <div className='partition'>
                <FormControlLabel
                  value="Aug 8 2024"
                  control={<Radio />}
                  label="Aug 8 2024"
                />
                <div className='partition-schedule'>
                  <p className='batch-date'>09:00 PM IST <span className='date-span'>(1 hour)</span></p>
                  <p className='demo'><FaCircle style={{ marginRight: '1vh', height: '20px', width: '20px' }} />Live Demo</p>
                </div>
=======
          {/* First batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch1" 
                checked={selectedBatch === 'batch1'}
                onChange={() => handleBatchSelect('batch1')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Aug 8 2024 <span className='date-span'>(Thursday)</span></p>
                <p className='batch-date'>09:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon'/>Live Demo</p>
>>>>>>> b3cb04845df15ddb26d494293bc9ded49ae1e256
              </div>

<<<<<<< HEAD
              {/* Second batch */}
              <div className='partition'>
                <FormControlLabel
                  value="Sep 1 2024"
                  control={<Radio />}
                  label="Sep 1 2024"
                />
                <div className='partition-schedule'>
                  <p className='batch-date'>07:00 PM IST <span className='date-span'>(1 hour)</span></p>
                  <p className='demo'><FaCircle style={{ marginRight: '1vh', height: '20px', width: '20px' }} />Live Demo</p>
                </div>
=======
          {/* Second batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch2" 
                checked={selectedBatch === 'batch2'}
                onChange={() => handleBatchSelect('batch2')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Sep 1 2024 <span className='date-span'>(Sunday)</span></p>
                <p className='batch-date'>07:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon' />Live Demo</p>
>>>>>>> b3cb04845df15ddb26d494293bc9ded49ae1e256
              </div>

<<<<<<< HEAD
              {/* Third batch */}
              <div className='partition'>
                <FormControlLabel
                  value="Oct 5 2024"
                  control={<Radio />}
                  label="Oct 5 2024"
                />
                <div className='partition-schedule'>
                  <p className='batch-date'>05:00 PM IST <span className='date-span'>(1 hour)</span></p>
                  <p className='demo'><FaCircle style={{ marginRight: '1vh', height: '20px', width: '20px' }} />Live Demo</p>
                </div>
=======
          {/* Third batch */}
          <div className='partition'>
            <label className="radio-label">
              <input 
                type="radio" 
                name="batch" 
                value="batch3" 
                checked={selectedBatch === 'batch3'}
                onChange={() => handleBatchSelect('batch3')} 
                className="hidden-radio"
              />
              <span className="custom-radio"></span>
              <div className='partition-schedule'>
                <p className='batch-date'>Oct 5 2024 <span className='date-span'>(Saturday)</span></p>
                <p className='batch-date'>05:00 PM IST <span className='date-span'>(1 hour)</span></p>
                <p className='demo'><FaCircle className='demo-icon'/>Live Demo</p>
>>>>>>> b3cb04845df15ddb26d494293bc9ded49ae1e256
              </div>

            </RadioGroup>
          </FormControl>
        </div>
        
        <div className='separator'></div>
        <LiveOnlineFeesRight fee="Free" enrollText="Enroll Now" />
      </div>
    </>
  );
};

export default LiveOnlineFees;
