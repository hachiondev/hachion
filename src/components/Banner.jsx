import React, { useState } from "react";
import styles from "./Banner.module.css";
import { cn } from "../lib/utils";
import heroImage from "../assets/images/banner-hero.png";
import Medal from "../assets/icons/medal.svg";
import LoginRequired from "./LoginRequired";
import VideoModal from "./VideoModal";
import { Link, useNavigate } from "react-router-dom";
import EnrollPay from "./EnrollPay";

/* --- Tiny inline icons (SVGS) --- */
const Star = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="#FFB608" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);
const Clock = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h-4V7h2v4h2z" />
    </svg>
);
const Certificate = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M20 2H4a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h5a2 2 0 002-2V4a2 2 0 00-2-2zM6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z" />
    </svg>
);
const Play = (p) => (
    <svg viewBox="0 0 24 24" width="26" height="26" {...p}>
        <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
);

function OfferStrip({ leftText = "Flash Sale! Get 10% OFF & Save INR 2000/-", rightText = "⏳ Hurry! Offer ends in 2 days" }) {
    return (
        <div className={styles.bnoffertop}>
            <div className="container">
                <div className={styles.bnoffer}>

                    <div className={styles.bnofferleft}>{leftText}</div>
                    <div className={styles.bnofferright}>{rightText}</div>
                </div>
            </div>
        </div>
    );
}

/* --- Banner --- */
export default function Banner({
    level = "Beginner level",
    title = "Become a Certified Web Developer Bootcamp 2025",
    subtitle = "Master the web from scratch — real-world skills in HTML, CSS, and JavaScript. Learn to build responsive, interactive websites.",
    author = "Keny White",
    categories = ["Business", "IT & Software", "Technology"],
    rating = 4.9,
    reviews = 280,
    enrolled = "2,500+ Students Enrolled",
    duration = "12 weeks",
    certificate = "Certificate included",
    price = "INR 129",
    oldPrice = "INR 150",
    offerTag = "Limited time offer",
    ctaText = "Enroll Now - Start Learning",
    // onEnroll = () => { },
    onAddToCart = () => { },
    statWeeks = "12",
    statProjects = "08",
    statSupport = "24/7",
}) {
    const navigate = useNavigate();
    const [showLoginRequired, setShowLoginRequired] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showEnroll, setShowEnroll] = useState(false);

    const handleAddToCart = () => {
        setShowLoginRequired(true);
    };

    const onEnroll = () => {
        navigate("/enroll-now");
        // setShowEnroll(true);
    }

    return (
        <section className={styles.bnwrap}>

            <OfferStrip />

            <div className={styles.bncardmain}>
                <div className={`container ${styles.bncard}`}>
                    {/* Left */}
                    <div className={styles.bnleft}>
                        <span className={styles.bnchip}>{level}</span>

                        <h1 className={styles.bntitle}>{title}</h1>

                        <p className={styles.bnsub}>{subtitle}</p>

                        <p className={styles.bnby}>
                            By <strong>{author}</strong> in {categories.join(", ")}
                        </p>

                        <div className={styles.bnmetrics}>
                            <span className={styles.bnmetric}>
                                <span className={styles.bnmetricnogap}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={styles.bnstar} />
                                    ))}</span> <b>{rating}</b> ({reviews} review)
                            </span>
                            <span className={styles.bnsep}></span>
                            <span className={styles.bnmetric}>
                                <img src={Medal} alt="icon" /> {enrolled}
                            </span>
                        </div>

                        <div className={styles.bnbullets}>
                            <span className={styles.bnbullet}><Clock /> {duration}</span>
                            <span className={styles.bnbullet}><Certificate /> {certificate}</span>
                        </div>

                        <div className={styles.bnpriceRow}>
                            <div className={styles.bnprice}>
                                <span className={styles.bnpricenow}>{price}</span>
                                <span className={styles.bnpriceold}>{oldPrice}</span>
                                <span className={styles.bntag}>{offerTag}</span>
                            </div>

                            <div className={styles.bnctaRow}>
                                {/* <Link to="/enroll-now"> */}
                                <button className={cn(styles.bnbtn, styles.bnbtnprimary)} onClick={onEnroll}>
                                    {ctaText}
                                </button>
                                {/* </Link> */}
                                <button className={styles.bnlink} onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                            </div>

                            <div className={styles.bnnote}>• Lifetime access • EMI starting at $29/month</div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className={styles.bnright}>
                        <div className={styles.bnhero}>
                            <img src={heroImage} alt="Course preview" />
                            <button className={styles.bnplay} aria-label="Watch demo videos" onClick={() => setShowVideo(true)}>
                                <Play />
                            </button>
                            <div className={styles.bnherotext}>Watch Demo Videos</div>

                            <div className={styles.bnstats}>
                                <div className={styles.bnstat}>
                                    <div className={cn(styles.bnstatval, styles.bnstatvalBlue)}>{statWeeks}</div>
                                    <div className={styles.bnstatlabel}>Weeks</div>
                                </div>
                                <div className={styles.bnstat}>
                                    <div className={cn(styles.bnstatval, styles.bnstatvalGreen)}>{statProjects}</div>
                                    <div className={styles.bnstatlabel}>Projects</div>
                                </div>
                                <div className={styles.bnstat}>
                                    <div className={cn(styles.bnstatval, styles.bnstatvalPurple)}>{statSupport}</div>
                                    <div className={styles.bnstatlabel}>Support</div>
                                </div>
                            </div>
                        </div>
                    </div>

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
            {showEnroll && (
                <EnrollPay
                    courseName="Web Developer: HTML, CSS and JavaScript"
                    totalAmount="₹4,999"
                    onClose={() => setShowEnroll(false)}
                    onPayNow={() => {
                        setShowEnroll(false);
                    }}
                />
            )}
            {showVideo && (
                <VideoModal
                    videoSrc={"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"}
                    onClose={() => setShowVideo(false)}
                />
            )}
        </section>
    );
}
