import React from "react";
import styles from "./LearnSection.module.css";
import checkMark from "../assets/icons/Checkmark.png";
import person from "../assets/icons/Person-2.png";
import job from "../assets/icons/job.png";

const CheckCircle = () => (
    <img src={checkMark} alt="check" className={styles.lsicon} />
);
const UserGroup = () => (
    <img src={person} alt="person" className={styles.lsicon} />
);
const Briefcase = () => (
     <img src={job} alt="job" className={styles.lsicon} />
);

const pills = [
    "Frontend Developer",
    "Full-Stack Developer",
    "Web Developer",
    "React Developer",
    "JavaScript Developer",
    "Software Engineer",
];

const tools = [
    { name: "Visual Studio Code", slug: "VS Code", image: 'vscode.png' },
    { name: "Bootstrap", slug: "Bootstrap", image: 'bootstrap.png' },
    { name: "GitHub", slug: "GitHub", image: 'GitHub.png' },
    { name: "jQuery", slug: "jQuery", image: 'jQuery.png' },
    { name: "Chrome DevTools", slug: "Chrome", image: 'Chrome.png' },
    { name: "Sublime Text", slug: "Sublime", image: 'sublime.png' },
];

export default function LearnSection() {
    return (
        <section className={styles.lswrap}>
            <div className={styles.lsgrid}>
                {/* LEFT: What you'll learn + prerequisites */}
                <div>
                    <h2 className={styles.lsh2}>What You’ll Learn</h2>
                    <ul className={styles.lslist}>
                        {[
                            "Build responsive websites using HTML5, CSS3, and JavaScript",
                            "Master React.js for creating dynamic user interfaces",
                            "Develop full-stack applications with Node.js and Express",
                            "Work with databases using MongoDB and SQL",
                            "Deploy applications to cloud platforms like AWS and Heroku",
                            "Implement user authentication and security best practices",
                            "Use Git for version control and collaborative development",
                            "Create RESTful APIs and integrate third-party services",
                        ].map((item) => (
                            <li key={item} className={styles.lslistitem}>
                                <CheckCircle />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.lspre}>
                        <h3>Prerequisites</h3>
                        <ul className={styles.lsbullets}>
                            <li>Basic computer skills and internet navigation</li>
                            <li>No programming experience required – we start from scratch</li>
                            <li>Access to a computer with internet connection</li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT: two cards */}
                <div className={styles.lsright}>
                    <div className={styles.lscard}>
                        <div className={styles.lscardhead}>
                            <span className={styles.lscardico}><UserGroup /></span>
                            <h3>Who this course is for</h3>
                        </div>
                        <ul className={styles.lscardbullets}>
                            <li>Complete beginners with no coding experience</li>
                            <li>Career changers looking to transition into tech</li>
                            <li>Developers wanting to strengthen their skills</li>
                            <li>Entrepreneurs building their own products</li>
                        </ul>
                    </div>

                    <div className={styles.lscard}>
                        <div className={styles.lscardhead}>
                            <span className={styles.lscardico}><Briefcase /></span>
                            <h3>Career Opportunities</h3>
                        </div>

                        <p className={styles.lsmuted}>Job Roles After Completion:</p>

                        <div className={styles.lspills}>
                            {pills.map((p) => (
                                <span key={p} className={styles.lspill}>{p}</span>
                            ))}
                        </div>

                        <div className={styles.lssalary}>
                            <div className={styles.lssalarytitle}>Average Salary Range</div>
                            <div className={styles.lssalaryval}>INR 65K – INR 95K</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Cover */}
            <div className={styles.lstools}>
                <h3 className={styles.lstoolstitle}>Tools Cover</h3>

                <div className={styles.lstoolsgrid}>
                    {tools.map((t) => (
                        <div key={t.name} className={styles.lstoolcard}>
                            <div className={styles.lstoolicon}>
                                <img src={t.image} alt={t.name} className={styles.lstooliconimg} />
                            </div>
                            
                            <div className={styles.lstoolname}>{t.name}</div>
                            <a className={styles.lstoollink} href="#" onClick={(e) => e.preventDefault()}>
                                Download link
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
