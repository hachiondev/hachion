import React from 'react';

const LiveOnlineFeesRight = ({ fee, enrollText }) => {
  return (
    <>
      <div className='right'>
        <p className='batch-date'>Fee : </p>
        <p className='free'>{fee}</p>
        <button className='enroll-now'>{enrollText}</button>
      </div>
    </>
  );
};

export default LiveOnlineFeesRight;
