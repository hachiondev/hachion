import React,{useState} from 'react';
import './Course.css';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import success from '../../Assets/success.gif';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useFormik } from 'formik';
import { LoginSchema } from '../Schemas';

const initialValues = {
  name: "",
  email: "",
  number:"",
  comment:""
};

const HaveAnyQuery = ({ closeModal }) => {
  const [showModal, setShowModal] = useState(false);

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log(values);
    }
  });
const handleContact=(e)=>{
  e.preventDefault();
  setShowModal(true);
}


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
            
          
          <form className='query-form' onSubmit={handleSubmit}>
            <div className="form-group col-10">
              <label htmlFor="inputName" className="form-label">Full Name*</label>
              <input type="text" className="form-control" id="query1" placeholder="Enter your full name"
              name='name'
               value={values.name}
               onChange={handleChange}
               onBlur={handleBlur}/>
            </div>
            {errors.name && touched.name ? (<p className='form-error'>{errors.name}</p>) : null}

            <div className="form-group col-10">
              <label htmlFor="inputEmail" className="form-label">Email ID</label>
              <input type="email" className="form-control" id="query1" placeholder="abc@gmail.com"
              name='email'
               value={values.email}
               onChange={handleChange}
               onBlur={handleBlur}/>
            </div>
            {errors.email && touched.email ? (<p className='form-error'>{errors.email}</p>) : null}
            
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
  <input type="number" className="mobile-number" id='query2' aria-label="Text input with segmented dropdown button" placeholder='Enter your mobile number'
   name='number'
   value={values.number}
   onChange={handleChange}
   onBlur={handleBlur}/>
</div>
{errors.number && touched.number ? (<p className='form-error'>{errors.number}</p>) : null}
            <div className="mb-4">
              <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
              <textarea className="form-control" id="query3" rows="4"
              name='comment'
               value={values.comment}
               onChange={handleChange}
               onBlur={handleBlur}></textarea>
            </div>
            {errors.comment && touched.comment ? (<p className='form-error'>{errors.comment}</p>) : null}
            <button className="btn btn-primary btn-submit" type="submit" onClick={handleContact}>Contact Us</button>
          </form>
          {showModal && (
            <div className='modal' style={{ display: 'block' }} onClick={() => setShowModal(false)}>
              <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-content' id='#querymodal'>
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
    </div>
  );
};

export default HaveAnyQuery;