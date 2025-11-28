import React, { useState } from "react";
import styles from "./FinalCTA.module.css";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import LoginRequired from "./LoginRequired";

export default function FinalCTA({
  price = "INR 129",
  mrp = "INR 150",
  discount = "Save 65%",
  onEnroll = () => { },
  onAddToCart = () => { },
  timerText = "Limited time offer– 48 Hours Left",
}) {
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const handleAddToCart = () => {
    setShowLoginRequired(true);
  };

  return (
    <section className={styles.ctawrap}>
      <div className="container">
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
            <Link to="/enroll-now">
              <button className={styles.ctabtn}>
                <span className="ico"><img src="Rocket.png" alt="logo" width="25" /></span>
                Enroll Now & Start Today
              </button>
            </Link>
            <button className={styles.ctalink} onClick={handleAddToCart}>
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

        {showLoginRequired && (
          <LoginRequired
            title="Login Required"
            subtitle="To add items to cart please Login"
            onCancel={() => setShowLoginRequired(false)}
            onLogin={() => {
              setShowLoginRequired(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
