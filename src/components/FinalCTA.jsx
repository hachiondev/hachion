import React from "react";
import styles from "./FinalCTA.module.css";
import { cn } from "../lib/utils";

const Lock = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2zm-6 8.73V18h2v-1.27a2 2 0 10-2 0zM9 6a3 3 0 116 0v2H9V6z"/>
  </svg>
);
const Card = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M2 6a2 2 0 012-2h16a2 2 0 012 2v3H2V6zm0 5h20v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7zm3 4h6v2H5v-2z"/>
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm6.93 6h-3.26A14.91 14.91 0 0015 4.26 8.06 8.06 0 0118.93 8zM12 4a13.18 13.18 0 011.86 4H10.1A13.18 13.18 0 0112 4zM5.07 8A8.06 8.06 0 019 4.26 14.91 14.91 0 008.33 8zm0 8h3.26A14.91 14.91 0 019 19.74 8.06 8.06 0 015.07 16zM12 20a13.18 13.18 0 01-1.9-4h3.76A13.18 13.18 0 0112 20zM7.1 14a15.59 15.59 0 01-.2-2 15.59 15.59 0 01.2-2h9.8a15.59 15.59 0 01.2 2 15.59 15.59 0 01-.2 2zM18.93 16A8.06 8.06 0 0115 19.74 14.91 14.91 0 0015.67 16z"/>
  </svg>
);

export default function FinalCTA({
  price = "INR 129",
  mrp = "INR 150",
  discount = "Save 65%",
  onEnroll = () => {},
  onAddToCart = () => {},
  timerText = "Limited time offer– 48 Hours Left",
}) {
  return (
    <section className={styles.ctawrap}>
      <div className={styles.ctacard}>
        {/* top pill */}
        <div className={styles.ctapill}>
          <img src="Clock.png" alt="logo" /> {timerText}
        </div>

        {/* heading */}
        <h2 className={styles.ctatitle}>Ready to Transform Your Career?</h2>
        <p className={styles.ctasub}>
          Join thousands of successful graduates who landed their dream jobs after
          completing this course
        </p>

        {/* price row */}
        <div className={styles.ctapriceRow}>
          <span className={styles.ctaprice}>{price}</span>
          <span className={styles.ctamrp}>{mrp}</span>
          <span className={styles.ctasave}>{discount}</span>
        </div>

        {/* ctas */}
        <div className={styles.ctaactions}>
          <button className={styles.ctabtn} onClick={onEnroll}>
            <span className="ico"><img src="Rocket.png" alt="logo" width="25" /></span>
            Enroll Now & Start Today
          </button>
          <button className={styles.ctalink} onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>

        {/* quick perks */}
        <ul className={styles.ctaperks}>
          <li>30-Day Guarantee</li>
          <li>EMI from INR 1000/mo</li>
          <li>24/7 Support</li>
          <li>Lifetime Access</li>
        </ul>

        {/* what you get panel */}
        <div className={styles.ctapanel}>
          <div className={styles.ctapanelhead}>🎁 What You Get Today:</div>
          <div className={styles.ctapanelGrid}>
            <ul>
              <li>✓ Complete 12-week curriculum</li>
              <li>✓ 8 hands-on projects</li>
              <li>✓ 1-on-1 mentorship sessions</li>
              <li>✓ Industry-recognized certificate</li>
            </ul>
            <ul>
              <li>✓ Career support & job referrals</li>
              <li>✓ Lifetime access to materials</li>
              <li>✓ Private student community</li>
              <li>✓ Free course updates</li>
            </ul>
          </div>
        </div>

        {/* assurances */}
        {/* 🔒 Secure payment •      💳 All major cards accepted •       🌍 Available worldwide */}
        <div className={styles.ctaassure}>
          <span>🔒 Secure payment</span>
          <span>•</span>
          <span>💳 All major cards accepted</span>
          <span>•</span>
          <span>🌍 Available worldwide</span>
        </div>
      </div>
    </section>
  );
}
