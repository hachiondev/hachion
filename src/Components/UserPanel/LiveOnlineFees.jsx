import React, { useState } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

export const LiveOnlineFees = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
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
              </div>

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
              </div>

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
