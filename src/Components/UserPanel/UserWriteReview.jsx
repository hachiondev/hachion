import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import './Blogs.css';
import './Dashboard.css';

const UserWriteReview = ({ setShowReviewForm }) => {
    return (
        <>
        <div className='write-review'>
            <div className='courses-enrolled'>
            <nav className='dashboard-nav'>
            Write a Review</nav>
            </div>
            <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
            <a href="#!" onClick={() => setShowReviewForm(false)}> Reviews </a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
            Write a Review
            </li>
          </ol>
        </nav>

            {/* Form Row with two input fields */}
            <div className="input-row">
                <div className="col-md-5">
                    <label className='form-label'>Name</label>
                    <input id="inputName" type="text" className="form-control" placeholder="Hachion" aria-label="First name" />
                </div>
                <div className="col-md-5">
                    <label className='form-label'>Email</label>
                    <input id="inputEmail" type="email" className="form-control" placeholder="Hachion@gmail.com" aria-label="Email" />
                </div>
            </div>

            {/* Another row with two dropdowns */}
            <div className="input-row">
                <div className="col-md-5">
                    <label htmlFor="inputState" className="form-label">Review Type</label>
                    <select id="inputState" className="form-select">
                        <option selected>Select Type</option>
                        <option>Course Review</option>
                        <option>Trainer Review</option>
                    </select>
                </div>
                <div className="col-md-5">
                    <label htmlFor="inputState" className="form-label">Course Name</label>
                    <select id="inputState" className="form-select">
                        <option selected>Select Course</option>
                        <option>QA Automation</option>
                        <option>Load Runner</option>
                        <option>QA Manual Testing</option>
                        <option>Mobile App Testing</option>
                    </select>
                </div>
            </div>

            {/* Row for Trainer and Social Media ID */}
            <div className="input-row">
                <div className="col-md-5">
                    <label htmlFor="inputState" className="form-label">Trainer Name</label>
                    <select id="inputState" className="form-select">
                        <option selected>Select Trainer</option>
                        <option>Navya</option>
                        <option>Havilla</option>
                    </select>
                </div>
                <div className="col-md-5">
                    <label htmlFor="inputState" className="form-label">Select ID</label>
                    <select id="inputState" className="form-select">
                        <option selected>Select</option>
                        <option>LinkedIn</option>
                        <option>Facebook</option>
                        <option>Twitter</option>
                        <option>Instagram</option>
                        <option>Other..</option>
                    </select>
                </div>
            </div>

            {/* Rating and Review Textarea */}
            <Box sx={{ '& > legend': { mt: 2,ml: 6 } }}>
                <Typography component="legend">Rating</Typography>
                <Rating name="no-value" sx={{ml:6, mt:1}} value={null} />
            </Box>

            <div className="mb-3 mt-3" >
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Review</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>

            {/* Submit Button */}
            
            <div className='center'>
            <button className='update-btn'>Submit</button>
            </div>
            </div>
        </>
    );
}

export default UserWriteReview;