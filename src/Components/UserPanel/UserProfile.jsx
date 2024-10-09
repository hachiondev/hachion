import React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { FiCamera } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const UpdateButton = styled('button')({
  backgroundColor: '#00AEEF',
  color: 'white',
  borderRadius: '10px',
  padding: '5px 30px',
  border: 'none',
  cursor: 'pointer',
});

const UserProfile = () => {
  return (
    <>
      <div className="courses-enrolled">
        <h6>My Profile</h6>
      </div>
      <div className="resume-div">
        <div className="d-flex align-items-center mb-3">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <SmallAvatar>
                <FiCamera size={16} />
              </SmallAvatar>
            }
          >
            <LargeAvatar>
              <FaUserAlt size={50} />
            </LargeAvatar>
          </StyledBadge>
          <div className="d-flex ms-4">
            <div className="me-3">
              <label htmlFor="inputEmail4" className="form-label">Name</label>
              <input type="text" className="form-control mb-2" id="inputEmail4" placeholder='hachion' />
            </div>
            <div>
              <label htmlFor="inputEmail4" className="form-label">Email</label>
              <input type="email" className="form-control mb-2" id="inputEmail4" placeholder='hachion@gmail.com' />
            </div>
          </div>
        </div>
        <form className="row g-3">
          <div className="col-md-5 mb-2">
            <label htmlFor="inputNumber4" className="form-label">Mobile</label>
            <input type="number" className="form-control" id="inputNumber4" placeholder='9999999999' />
          </div>
          <div className="col-md-5 mb-2">
            <label htmlFor="inputLocation4" className="form-label">Location</label>
            <input type="text" className="form-control" id="inputLocation4" />
          </div>
          <div className="col-md-4 mb-2">
            <label htmlFor="inputState" className="form-label">Gender</label>
            <select id="inputState" className="form-select">
              <option selected>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="col-12 text-center mt-3">
            <UpdateButton>Update</UpdateButton>
          </div>
          <p>Reset Password</p>
          <div className="col-md-5 mb-2">
            <label htmlFor="inputPassword4" className="form-label">Old Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="col-md-5 mb-2">
            <label htmlFor="inputPassword4" className="form-label">New Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="col-md-5 mb-2">
            <label htmlFor="inputPassword4" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="col-12 text-center mt-3">
            <UpdateButton>Update</UpdateButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfile;
