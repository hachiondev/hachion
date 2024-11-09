import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { FiCamera, FiX } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import './Dashboard.css';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#FFFFFF',
    border: '3px solid #00AEEF',
    color: '#00AEEF',
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}));

const LargeAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  border: '4px solid #00AEEF',
  backgroundColor: '#ffffff'
});

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <>
      <div className="courses-enrolled">
        <nav className='dashboard-nav'>My Profile</nav>
      </div>
      <div className="resume-div">
        <form className="row">
          <div className="input-row">
            <div className="profile">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  profileImage ? (
                    <FiX size={16} color="red" onClick={removeImage} />
                  ) : (
                    <label htmlFor="imageUpload">
                      <FiCamera size={16} />
                      <input
                        type="file"
                        id="imageUpload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  )
                }
              >
                <LargeAvatar src={profileImage}>
                  {!profileImage && <FaUserAlt size={50} color="#00AEEF" />}
                </LargeAvatar>
              </StyledBadge>
            </div>
            <div className="me-3">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input type="text" className="form-control mb-2" id="inputName" placeholder="hachion" />
            </div>
            <div className="me-3">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input type="email" className="form-control mb-2" id="inputEmail" placeholder="hachion@gmail.com" />
            </div>
          </div>
      
          <div className="input-row">
          <div className="me-3">
            <label htmlFor="inputNumber4" className="form-label">Mobile</label>
            <input type="number" className="form-control" id="inputNumber4" placeholder='9999999999' />
          </div>
          <div className="me-3">
            <label htmlFor="inputLocation4" className="form-label">Location</label>
            <input type="text" className="form-control" id="inputLocation4" />
          </div>
          <div className="me-3">
            <label htmlFor="inputState" className="form-label">Gender</label>
            <select id="inputState" className="form-select">
              <option selected>Male</option>
              <option>Female</option>
            </select>
          </div>
          </div>
          <div className="center">
          <button className='update-btn'> Update</button>
          </div>

          <p>Reset Password</p>
          <div className="input-row">
          <div className="me-3">
            <label htmlFor="inputPassword4" className="form-label">Old Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="me-3">
            <label htmlFor="inputPassword4" className="form-label">New Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="me-3">
            <label htmlFor="inputPassword4" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          </div>
          <div className="center">
          <button className='update-btn'> Update</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfile;
