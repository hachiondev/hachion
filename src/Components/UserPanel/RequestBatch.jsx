import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendar from '../../Assets/calendar.png'; // Black calendar icon
import './Course.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const RequestBatch = ({ closeModal }) => {
  const [startDate, setStartDate] = useState(null);
  const [time, setTime] = useState(''); // State for time
  const timeInputRef = useRef(null); // Ref for time input

  return (
    <>
      <div className='request-batch'>
        <div className='request-header'>Let us know your preferred start date</div>
        <form>
          <AiOutlineCloseCircle onClick={closeModal} className='button-close' />

          <div className='form-group col-10'>
            <label htmlFor='inputDate' className='form-label'>
              Preferred batch start date
            </label>
            <div className='date-picker-wrapper'>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat='dd/MM/yyyy'
                placeholderText='DD/MM/YYYY'
                className='form-control date-picker'
              />
              <img
                src={calendar}
                alt='calendar'
                className='icon-right black-calendar'
                onClick={() => document.querySelector('.react-datepicker__input-container input').focus()}
              />
            </div>
          </div>

          <div className='form-group col-10' style={{ position: 'relative' }}>
            <label htmlFor='inputTime' className='form-label'>
              Preferred batch Time
            </label>
            <input
              type='time'
              ref={timeInputRef}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className='form-control time-picker'
            />
          </div>

          <div className='form-group col-10'>
            <label htmlFor='inputEmail' className='form-label'>
              Email ID
            </label>
            <input type='email' className='form-control' id='inputEmail' placeholder='abc@gmail.com' />
          </div>

          <label htmlFor='inputNumber' className='form-label'>
            Mobile Number
          </label>
          <div className='form-group col-10 mobile-number-container'>
            <select className='form-select'>
              <option>+1</option>
              <option>+91</option>
              <option>+44</option>
            </select>
            <input type='number' className='form-control' id='inputNumber' placeholder='Enter your number' />
          </div>

          <button className='btn btn-primary btn-submit' type='button'>
            Submit Request
          </button>
        </form>
      </div>
    </>
  );
};

export default RequestBatch;
