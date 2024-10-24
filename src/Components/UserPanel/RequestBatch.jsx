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
        <form className='request-form'>
          <AiOutlineCloseCircle onClick={closeModal} className='button-close' />

          <div className='form-group col-10'>
            <label htmlFor='inputDate' className='form-label'>
              Preferred batch start date
            </label>
            <div className='date-picker-wrapper'>
              <input
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat='dd/MM/yyyy'
                placeholderText='DD/MM/YYYY'
                className='form-control date-picker'
                id='query1'
              
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
              id='query1'
            />
          </div>

          <div className='form-group col-10'>
            <label htmlFor='inputEmail' className='form-label'>
              Email ID
            </label>
            <input type='email' className='form-control' id='query1' placeholder='abc@gmail.com'  />
          </div>

          <label className='form-label'>Mobile Number</label>
<div class="input-group mb-3 custom-width">
  <button type="button" class="btn btn-outline-secondary">+91</button>
  <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">select</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">+91</a></li>
    <li><a class="dropdown-item" href="#">+66</a></li>
    <li><a class="dropdown-item" href="#">+11</a></li>
    <li><a class="dropdown-item" href="#">+20</a></li>
  </ul>
  <input type="number" className="mobile-number" aria-label="Text input with segmented dropdown button" id='query2' placeholder='Enter your mobile number'/>
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