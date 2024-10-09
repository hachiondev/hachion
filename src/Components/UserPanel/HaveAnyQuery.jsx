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
            
            <label htmlFor="inputNumber" className="form-label">Mobile Number</label>
            <div className="form-group col-10 mobile-number-container">
              <select className="form-select">
                <option>+1</option>
                <option>+91</option>
                <option>+44</option>
              </select>
              <input type="number" className="form-control" id="inputNumber" placeholder="Enter your number"/>
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
