import React from "react";
import styles from "./CareerOutcomes.module.css";
import { cn } from "../lib/utils";

const Rupee = () => (
  <img src="Rupee.png" alt="rupee" width="44" height="44" />
);
const Trend = () => (
  <img src="Trend.png" alt="trend" width="44" height="44" />
);
const Users = () => (
  <img src="Bag.png" alt="users" width="44" height="44" />
);

const paths = [
  { role: "Frontend Developer",      tags: "High demand • Remote friendly", level: "Entry level" },
  { role: "Full-Stack Developer",    tags: "High demand • Remote friendly", level: "Entry level" },
  { role: "Web Developer",           tags: "High demand • Remote friendly", level: "Entry level" },
  { role: "React Developer",         tags: "High demand • Remote friendly", level: "Entry level" },
  { role: "JavaScript Developer",    tags: "High demand • Remote friendly", level: "Entry level" },
];

const companies = [
  { name: "Google",  logo: "Google.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", logo: "Amazon.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg" },
  { name: "Meta", logo: "Meta.png" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
];

export default function CareerOutcomes() {
  return (
    <section className={styles.cowrap}>
      <div className={styles.cohead}>
        <h2>Career Outcomes & Opportunities</h2>
        <p>Our graduates land high-paying jobs at top companies worldwide</p>
      </div>

      {/* Top KPI cards */}
      <div className={styles.cokpis}>
        <div className={styles.cokpi}>
          <div className={styles.cokpiico}><Rupee /></div>
          <div className={styles.cokpimain}>INR 65K – INR 95K</div>
          <div className={styles.cokpisub}>Average starting salary for graduates</div>
          <div className={cn(styles.cochip, styles.cochipgreen)}>+15% year-over-year</div>
        </div>
        <div className={styles.cokpi}>
          <div className={styles.cokpiico}><Trend /></div>
          <div className={styles.cokpimain}>94%</div>
          <div className={styles.cokpisub}>Job placement rate within 6 months</div>
          <div className={cn(styles.cochip, styles.cochipblue)}>Industry leading</div>
        </div>
        <div className={styles.cokpi}>
          <div className={styles.cokpiico}><Users /></div>
          <div className={styles.cokpimain}>2,500+</div>
          <div className={styles.cokpisub}>Alumni successfully placed</div>
          <div className={cn(styles.cochip, styles.cochippurple)}>Growing network</div>
        </div>
      </div>

      {/* bottom grid */}
      <div className={styles.cogrid}>
        {/* left: career paths */}
        <div className={styles.cocard}>
          <div className={styles.cocardhead}>
            <span className={styles.cocardico}>💼</span>
            Career Paths After Completion
          </div>

          <div className={styles.copaths}>
            {paths.map((p) => (
              <div className={styles.copath} key={p.role}>
                <div className={styles.copathleft}>
                  <div className={styles.copathrole}>{p.role}</div>
                  <div className={styles.copathtags}>{p.tags}</div>
                </div>
                <div className={styles.copathright}>
                  <div className={styles.cosalary}>INR 65K – INR 95K</div>
                  <div className={styles.colevel}>{p.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: logos + support */}
        <div className={styles.coright}>
          <div className={styles.cocard}>
            <div className={styles.cocardhead}>
              <span className={styles.cocardico}>🧑‍🎓</span>
              Where Our Graduates Work
            </div>

            <div className={styles.cologos}>
              {companies.map((c) => (
                <div className={styles.cologo} key={c.name} title={c.name}>
                  {/* You can replace <img> with local SVGs if you prefer */}
                  <img src={c.logo} alt={c.name} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cosupport}>
            <div className={styles.cosupporthead}>
              <span className={styles.cocardico}>🚀</span>
              Career Support Included:
            </div>
            <ul>
              <li>Resume review and optimisation</li>
              <li>Mock interview sessions</li>
              <li>LinkedIn profile optimization</li>
              <li>Job referral network access</li>
              <li>Career guidance calls</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
