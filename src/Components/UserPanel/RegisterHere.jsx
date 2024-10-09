import React from 'react'
import './Login.css'
import logo from '../../Assets/logo.png'
import LoginSide from './LoginSide'
import {useFormik} from 'formik';
import {LoginSchema} from '../Schemas'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom';

const initialValues={
  name:"",
  email:""
}

 const RegisterHere = () => {

  const {values,errors,handleBlur,touched,handleChange,handleSubmit}= useFormik({
    initialValues:initialValues,
    validationSchema:LoginSchema,
    onSubmit:(values)=>{
   console.log(values);
    }
   })

    const navigate=useNavigate();

const handleClick=()=>{
    navigate('/registerverification')
}

  return (
  <>
<div className='login'>
<div className='login-left'>
  <div className='login-top'>
  <img src={logo} alt='logo' className='login-logo'/>
  <h3 className='register-learning'>Register to start learning</h3>
 
<div className='steps'>
    <h4 className='steps-head'>Steps: </h4>
    <div className='step-one'>
      <h6 className='steps-head-one'>1</h6>
</div>
<hr width='55%' size='1' color='#00AAEF'/>
<div className='step-two'>
  <h6 className='steps-head-two'>2</h6>
</div>
</div>
<form onSubmit={handleSubmit}>
<div className='login-mid-name'>
<label className='login-label'>Full Name<span className='star'>*</span></label>
<div className="input-group mb-2">
  <input type="string" className="form-control" id="floatingName" placeholder="Enter your name"
   name='name' value={values.name} onChange={handleChange} onBlur={handleBlur}/>
</div>
{errors.name && touched.name ? (<p className='form-error'>{errors.name}</p>):null}

<label className='login-label'>Email ID<span className='star'>*</span></label>
<div className="input-group mb-2">
  <input type="email" className="form-control" id="floatingEmail" placeholder="abc@gmail.com"
   name='email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
  </div>
  {errors.email && touched.email ? (<p className='form-error'>{errors.email}</p>):null}

<button className='register-btn' onClick={handleClick}>Verify</button>
</div>
</form>
<p className='login-with-hachion'>Do you have an account with Hachion? <Link to='/login' className='link-to'>Click here to Login</Link></p>
</div>
</div>
<LoginSide/>
</div>
  </>
  )
}
export default RegisterHere;