import React, { useEffect } from 'react';
import '../Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className='refund-container'>
                {/* Breadcrumb */}
                <div className='refund-header'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/">Home</a> <MdKeyboardArrowRight className='breadcrumb-icon' />
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Refund Policy
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Main Content */}
                <div className='refund-content container'>
                    <header className='refund-title-section'>
                        <h1 className='refund-main-title'>Refund Policy</h1>
                    </header>

                    {/* Main Refund Content */}
                    <section className='refund-section'>
                        <h2 className='section-title'>Hachion Refund Policy</h2>
                        
                        <div className='refund-policy-card'>
                            <div className='refund-item refund-highlight'>
                                <div className='refund-icon'>✓</div>
                                <div className='refund-text'>
                                    <strong>100% refund</strong> if cancellation is requested until <strong>three trial classes before the start of 4th class</strong>
                                </div>
                            </div>

                            <div className='refund-item refund-warning'>
                                <div className='refund-icon'>✗</div>
                                <div className='refund-text'>
                                    <strong>No refunds once:</strong>
                                    <ul className='refund-sublist'>
                                        <li>Course has started</li>
                                        <li>Any session is attended</li>
                                        <li>Recordings / LMS access are provided</li>
                                    </ul>
                                </div>
                            </div>

                            <div className='refund-item refund-warning'>
                                <div className='refund-icon'>⚠</div>
                                <div className='refund-text'>
                                    <strong>EMI / partial payment enrollments are non-refundable</strong> after course start.
                                </div>
                            </div>

                            <div className='refund-item'>
                                <div className='refund-icon'>ℹ</div>
                                <div className='refund-text'>
                                    Students discontinuing mid-course remain liable for remaining installments.
                                </div>
                            </div>

                            <div className='refund-item refund-warning'>
                                <div className='refund-icon'>✗</div>
                                <div className='refund-text'>
                                    <strong>No refunds for:</strong>
                                    <ul className='refund-sublist'>
                                        <li>Missed classes</li>
                                        <li>Personal schedule conflicts</li>
                                        <li>Internet or technical issues</li>
                                    </ul>
                                </div>
                            </div>

                            <div className='refund-item refund-info'>
                                <div className='refund-icon'>🔄</div>
                                <div className='refund-text'>
                                    <strong>If Hachion cancels a batch:</strong>
                                    <ul className='refund-sublist'>
                                        <li>Student may choose a <strong>rescheduled batch</strong> or <strong>refund</strong> (as applicable)</li>
                                        <li>Refunds are processed to the <strong>original payment method</strong> within <strong>7–10 business days</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className='important-notes'>
                            <h3 className='notes-title'>Important Notes:</h3>
                            <ul className='notes-list'>
                                <li>All refund requests must be submitted in writing to <a href="mailto:support@hachion.co">support@hachion.co</a></li>
                                <li>Refund eligibility is determined based on the date the written request is received</li>
                                <li>Processing times may vary depending on your payment method and financial institution</li>
                            </ul>
                        </div>
                    </section>

                    {/* Closing Message */}
                    <div className='closing-message'>
                        <p>Thanks for choosing Hachion as your learning partner. We're here to empower your educational journey!</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RefundPolicy;