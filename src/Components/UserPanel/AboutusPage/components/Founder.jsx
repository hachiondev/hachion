
const Founder = ({ founder }) => {
    return (
        <div className="instructor-banner container">
            <div className="about-content">
                <h2 className="about-head">Meet the Founder</h2>
                <p className="about-partner">
                    Name :<span> Lakshmi Prasad</span>
                </p>
                <p className="about-partner">
                    Designation :<span> Managing Partner</span>
                </p>
                <p className="instructor-title-text">
                    At Hachion, visionary leadership meets innovation. Lakshmi Prasad
                    leads with a passion for technology, education, and digital
                    transformation, driving Hachion’s mission to make quality learning
                    accessible to all.
                </p>
                <p className="instructor-title-text">
                    His belief is simple — continuous learning creates limitless
                    opportunities. Under his guidance, Hachion empowers learners with
                    AI-driven, practical, and future-ready education designed to shape
                    successful global careers.
                </p>
                <p className="instructor-title-text">
                    “Education should not only teach you what to learn but inspire you
                    to grow.” – Lakshmi Prasad
                </p>
            </div>

            {/* Right side image */}
            <img
                className="corporate-image"
                src={founder}
                alt="Founder banner"
                fetchpriority="high"
            />
        </div>
    )
}

export default Founder