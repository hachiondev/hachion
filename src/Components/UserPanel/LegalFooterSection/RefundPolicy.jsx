import React, { useEffect, useState } from 'react';
import '../Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className='about-us'>
                <div className='blogs-header'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">Home</a> <MdKeyboardArrowRight />            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Refund Policy
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className='about-us-content container'>
                    <h1 className='about-us-heading'>Hachion Refund Policy</h1>

                    <div className='about-us-left-content'>
                        <ul className='refund-list'>
                            <li><strong>100% refund</strong> if cancellation is requested until <strong>three trial classes before the start of 4th class</strong></li>
                            <li>
                                <strong>No refunds once:</strong>
                                <ul className='refund-sublist'>
                                    <li>Course has started</li>
                                    <li>Any session is attended</li>
                                    <li>Recordings / LMS access are provided</li>
                                </ul>
                            </li>
                            <li><strong>EMI / partial payment enrollments are non-refundable</strong> after course start.</li>
                            <li>Students discontinuing mid-course remain liable for remaining installments.</li>
                            <li>
                                <strong>No refunds for:</strong>
                                <ul className='refund-sublist'>
                                    <li>Missed classes</li>
                                    <li>Personal schedule conflicts</li>
                                    <li>Internet or technical issues</li>
                                </ul>
                            </li>
                            <li>
                                <strong>If Hachion cancels a batch:</strong>
                                <ul className='refund-sublist'>
                                    <li>Student may choose a <strong>rescheduled batch</strong> or <strong>refund</strong> (as applicable).</li>
                                    <li>Refunds are processed to the <strong>original payment method</strong> within <strong>7–10 business days.</strong></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <p className='about-us-left-content' style={{ fontWeight: '600', paddingBottom: '50px', textAlign: 'center' }}>
                        Thanks for choosing Hachion as your learning buddy. We are here to empower your education journey!
                    </p>

                </div>

            </div>
        </>
    );
}

export default RefundPolicy;