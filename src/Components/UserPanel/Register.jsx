import React from 'react'
import LoginSide from './LoginSide'
import logo from '../../Assets/logo.png'
import './Login.css'
import email from '../../Assets/Group 39487.png'
import {Link} from 'react-router-dom';

const Register = () => {
  const googleLogin = () => {
    window.location.href = '/HachionUserDashboad/oauth2/authorization/google';  // Backend Google OAuth
  };

  return (
<>
<div className='login'>
<div className='login-left'>
<div className='login-top'>
  <img src={logo} alt='logo' className='login-logo'/>
  <h3 className='register-head'>Register to start learning</h3>
  <h5 className='option'>Tap on any option to create an account</h5>
  <div className='icon-places'>
    <Link to='/registerhere' className='register-link-to'>
   <div className='icon-text'>
  <img src={email} alt='login-with-email' className='icon-text-img'/> 
   <div className='icon-text-holder-email'>Sign-up with Email</div> 
    </div></Link>
   
  </div>
  </div>
  <p className='login-link'>Do you have an account with Hachion? <Link to='/login' className='link-to'>Click here to Login </Link></p>
</div>

<LoginSide/>
</div>
  
   </>
  )
}

export default Register;