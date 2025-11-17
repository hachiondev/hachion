import React from "react";
import styles from "./Footer.module.css";
import { cn } from "../lib/utils";
import logo from '../assets/images/logo-footer.png';

const Phone = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1v3.5a1 1 0 01-1 1C11.07 21 3 12.93 3 2.99a1 1 0 011-1H7.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.21z"/>
  </svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2l-8 5L4 6v0h16z"/>
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M4 12h14l-5-5 1.41-1.41L22.83 14l-8.42 8.41L13 21l5-5H4z"/>
  </svg>
);

const Social = ({ label }) => (
  <span className={cn(styles.ftsocial, styles[`ft${label.toLowerCase()}`])} aria-label={label}>{label[0]}</span>
);

export default function Footer() {
  return (
    <footer className={styles.ft}>
      <div className={styles.ftgrid}>
        {/* Brand + newsletter */}
        <div className={styles.ftbrand}>
          <a href="/" className={styles.ftlogo} aria-label="Hachion home">
            <img src={logo} alt="logo" />
          </a>

          <h3 className={styles.fttitle}>Subscribe to our <br/>newsletter</h3>

          <form
            className={styles.ftnewsletter}
            onSubmit={(e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get("email");
              console.log("subscribe:", email);
              e.currentTarget.reset();
            }}
          >
            <input
              name="email"
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              required
            />
            <button aria-label="Subscribe">
              <Arrow />
            </button>
          </form>

          <div className={styles.ftcontact}>
            <div className={styles.ftcontactrow}>
              <Phone /> <a href="tel:+919490323388">+91 94903 23388</a>
            </div>
            <div className={styles.ftcontactrow}>
              <Mail /> <a href="mailto:trainings@hachion.com">trainings@hachion.com</a>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className={styles.ftcols}>
          <div className={styles.ftcol}>
            <div className={styles.ftcolhead}>Trending Course</div>
            <ul>
              <li><a href="#">QA Manual Testing</a></li>
              <li><a href="#">Programming with C++</a></li>
              <li><a href="#">Machine Learning with AI</a></li>
              <li><a href="#">Power BI</a></li>
              <li><a href="#">Big Data</a></li>
              <li><a href="#">AI</a></li>
              <li><a href="#">QA Combo Course (Manual & Automation)</a></li>
              <li><a href="#">Salesforce Advance Admin</a></li>
              <li><a href="#">Website Testing</a></li>
              <li><a href="#">Azure DevOps</a></li>
            </ul>
          </div>

          <div className={styles.ftcol}>
            <div className={styles.ftcolhead}>Hachion</div>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Workshop</a></li>
            </ul>
          </div>

          <div className={styles.ftcol}>
            <div className={styles.ftcolhead}>Hachion</div>
            <ul>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Unsubscribe</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.ftbottomarea}>
      <div className={styles.ftbottom}>
        <div className={styles.ftwhats}>
          <img src="wa.png" alt="logo" />
          <a href="https://wa.me/17324852499" target="_blank" rel="noreferrer">
            +1 (732) 485–2499
          </a>
        </div>

        <div className={styles.ftmiddle}>Have any query?</div>

        <div className={styles.ftcopy}>© Hachion {new Date().getFullYear()}. All Rights Reserved.</div>

        <div className={styles.ftsocials}>
          {/* replace with real icons/links as needed */}
          <a href="#" aria-label="Facebook">
            <img src="fb.png" alt="logo" />
          </a>
          <a href="#" aria-label="X">
            <img src="x.png" alt="logo" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <img src="in.png" alt="logo" />
          </a>
          <a href="#" aria-label="Instagram">
            <img src="ig.png" alt="logo" />
          </a>
          <a href="#" aria-label="Quora">
            <img src="q.png" alt="logo" />
          </a>
          <a href="#" aria-label="YouTube">
            <img src="yt.png" alt="logo" />
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
}
