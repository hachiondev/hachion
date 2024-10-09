import React from 'react'
import LoginSide from './LoginSide'
import logo from '../../Assets/logo.png'
import './Login.css'
import facebook from '../../Assets/facebook_symbol.svg.png'
import google from '../../Assets/google_symbol.svg.png'
import linkedin from '../../Assets/linkedin.png';
import apple from '../../Assets/Apple.png'
import email from '../../Assets/Group 39487.png'
import {Link} from 'react-router-dom';

const Register = () => {
  return (
<>
<div className='login'>
<div className='login-left'>
<div className='login-top'>
  <img src={logo} alt='logo' className='login-logo'/>
  <h3 className='register-head'>Register to start learning</h3>
  <h4 className='option'>Tap on any option to create an account</h4>
  <div className='icon-places'>
    <div className='icon-text'>
  <img src={google} alt='google' className='icon-text-img'/>
   <div className='icon-text-holder-google'>Google</div>
    </div>
    <div className='icon-text' >
  <img src={facebook} alt='facebook' className='icon-text-img'/>
   <div className='icon-text-holder-facebook'>Facebook</div>
    </div>
    <div className='icon-text'>
  <img src={linkedin} alt='linkedin' className='icon-text-img-linkedin'/>
   <div className='icon-text-holder-linkedin'>Linkedin</div>
    </div>
    <div className='icon-text'>
  <img src={apple} alt='login-with-apple' className='icon-text-img'/>
   <div className='icon-text-holder-apple'>Apple</div>
    </div>
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