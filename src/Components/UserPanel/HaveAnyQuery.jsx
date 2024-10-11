import React from 'react';
import './Course.css';
import {AiOutlineCloseCircle} from 'react-icons/ai';

const HaveAnyQuery = ({ closeModal }) => {
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className='request-batch'>
          <div className='request-header'>
            Have any Query ?
          </div>
          <AiOutlineCloseCircle
            onClick={closeModal}
          className='button-close'/>
            
          
          <form>
            <div className="form-group col-10">
              <label htmlFor="inputName" className="form-label">Full Name*</label>
              <input type="text" className="form-control" id="inputName" placeholder="Enter your full name"/>
            </div>

            <div className="form-group col-10">
              <label htmlFor="inputEmail" className="form-label">Email ID</label>
              <input type="email" className="form-control" id="inputEmail" placeholder="abc@gmail.com"/>
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
  <input type="number" className="mobile-number" aria-label="Text input with segmented dropdown button" placeholder='Enter your mobile number'/>
</div>
            <div className="mb-4">
              <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="4"></textarea>
            </div>
            <button className="btn btn-primary btn-submit" type="button">Contact Us</button>
          </form>
        </div> 
      </div>
    </div>
  );
};

export default HaveAnyQuery;
