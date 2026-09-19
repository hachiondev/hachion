import Breadcrumb from "@/components/common/Breadcrumb";
import "../Blogs.css";

export default function RefundPolicy() {
  return (
    <div className="refund-container">
      <Breadcrumb label="Refund Policy" wrapperClassName="refund-header" />

      <div className="refund-content container">
        <header className="refund-title-section">
          <h1 className="refund-main-title"> Refund Policy</h1>
        </header>

        <section className="refund-section">
          <h2 className="section-title">Hachion Refund Policy</h2>

          <div className="refund-policy-card">
            <div className="refund-item refund-highlight">
              <div className="refund-icon">✓</div>
              <div className="refund-text">
                <strong>100% refund</strong> if cancellation is requested until <strong>three trial classes before the start of 4th class</strong>
              </div>
            </div>

            <div className="refund-item refund-warning">
              <div className="refund-icon">✗</div>
              <div className="refund-text">
                <strong>No refunds once:</strong>
                <ul className="refund-sublist">
                  <li>Course has started</li>
                  <li>Any session is attended</li>
                  <li>Recordings / LMS access are provided</li>
                </ul>
              </div>
            </div>

            <div className="refund-item refund-warning">
              <div className="refund-icon">⚠</div>
              <div className="refund-text">
                <strong>EMI / partial payment enrollments are non-refundable</strong> after course start.
              </div>
            </div>

            <div className="refund-item">
              <div className="refund-icon">ℹ</div>
              <div className="refund-text">
                Students discontinuing mid-course remain liable for remaining installments.
              </div>
            </div>

            <div className="refund-item refund-warning">
              <div className="refund-icon">✗</div>
              <div className="refund-text">
                <strong>No refunds for:</strong>
                <ul className="refund-sublist">
                  <li>Missed classes</li>
                  <li>Personal schedule conflicts</li>
                  <li>Internet or technical issues</li>
                </ul>
              </div>
            </div>

            <div className="refund-item refund-info">
              <div className="refund-icon">🔄</div>
              <div className="refund-text">
                <strong>If Hachion cancels a batch:</strong>
                <ul className="refund-sublist">
                  <li>Student may choose a <strong>rescheduled batch</strong> or <strong>refund</strong> (as applicable)</li>
                  <li>Refunds are processed to the <strong>original payment method</strong> within <strong>7–10 business days</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="closing-message">
          <p>Thanks for choosing Hachion as your learning partner. We&apos;re here to empower your educational journey!</p>
        </div>
      </div>
    </div>
  );
}
