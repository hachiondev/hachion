import React, { useState } from 'react';
import './Corporate.css';
import success from '../../Assets/success.gif';
import { RiCloseCircleLine } from 'react-icons/ri';

const Advisor = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setShowModal(true); // Open the modal
  };

  return (
    <>
      <div className='advisor'>
        <div className='advisor-form'>
          <div className='advisor-head'>
            <p>Talk to our Advisor</p>
          </div>
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputName4" className="form-label">
                Full Name<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter your full name' required />
            </div>
            <div className="col-md-5">
              <label htmlFor="inputCompany4" className="form-label">
                Company Name<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter your company name' required />
            </div>
            </div>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email ID<span className="required">*</span>
              </label>
              <input type="email" className="form-control" id="advisor1" placeholder='abc@gmail.com' required />
            </div>
            <div className="col-md-5">
            <label className='form-label'>Mobile Number</label>
<div class="input-group custom-width">
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
  <input type="number" className="mobile-number" id='advisor2' aria-label="Text input with segmented dropdown button" placeholder='Enter your mobile number'/>
  </div>
  </div>
            </div>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputState" className="form-label">
                No. of People<span className="required">*</span>
              </label>
              <select id="advisor1" className="form-select" required>
                <option selected disabled>Select number</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor="inputCourse4" className="form-label">
                Training Course<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter preferred course' required />
            </div>
            </div>
            <div className="col-10">
              <label htmlFor="Textarea" className="form-label">Comments</label>
              <textarea className="form-control" id="advisor3" placeholder="Enter comments here"></textarea>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className='submit-btn'>Submit</button>
            </div>
          </form>

          {showModal && (
            <div className='modal' style={{ display: 'block' }} onClick={() => setShowModal(false)}>
              <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-content'>
                  <button
                    className='close-btn'
                    aria-label='Close'
                    onClick={() => setShowModal(false)}
                  >
                    <RiCloseCircleLine />
                  </button>
                  <div className='modal-body'>
                    <img src={success} alt='Success' className='success-gif' />
                    <p className='modal-para'>
                      Thank you! Our Team will contact you soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Advisor;