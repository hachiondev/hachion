import React from 'react';
import './Corporate.css';

const Advisor = () => {
  return (
   <>
   <div className='advisor'>
      <div className='advisor-form'>
        <div className='advisor-head'>
            <p>Talk to our Advisor</p>
        </div>
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="inputName4" className="form-label">
              Full Name<span className="required">*</span>
            </label>
            <input type="text" className="form-control" id="inputName4" placeholder='Enter your full name'/>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputCompany4" className="form-label">
              Company Name<span className="required">*</span>
            </label>
            <input type="text" className="form-control" id="inputCompany4" placeholder='Enter your company name'/>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
              Email ID<span className="required">*</span>
            </label>
            <input type="email" className="form-control" id="inputEmail4" placeholder='abc@gmail.com'/>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNumber4" className="form-label">
              Mobile Number<span className="required">*</span>
            </label>
            <div className="form-group col-10 mobile-number-container">
              <select className="form-select">
                <option>+1</option>
                <option>+91</option>
                <option>+44</option>
              </select>
              <input type="number" className="form-control" id="inputNumber" placeholder="Enter your number"/>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputState" className="form-label">
              No. of People<span className="required">*</span>
            </label>
            <select id="inputState" className="form-select">
              <option selected>Select number</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputCourse4" className="form-label">
              Training Course<span className="required">*</span>
            </label>
            <input type="text" className="form-control" id="inputCourse4" placeholder='Enter preferred course'/>
          </div>
          <div className="col-10">
            <label htmlFor="Textarea" className="form-label">Comments</label>
            <textarea className="form-control" id="Textarea" placeholder="Enter comments here"></textarea>
          </div>
          <div className="col-12 text-center">
            <button className='submit-btn'>Submit</button>
          </div>
        </form>
      </div>
   </div>
   </>
  )
}

export default Advisor;
