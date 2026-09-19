import Image from "next/image";
import "./Corporate.css";
import icon1 from "@/assets/cc-icon1.webp";
import icon2 from "@/assets/cc-icon2.webp";
import icon3 from "@/assets/cc-icon3.webp";
import icon4 from "@/assets/cc-icon4.webp";
import icon5 from "@/assets/cc-icon5.webp";
import icon6 from "@/assets/cc-icon6.webp";
import training from "@/assets/corporate2.webp";

const features = [
  { icon: icon1, heading: 'Curated Learning', para: 'Handpicked content for your team’s success.' },
  { icon: icon2, heading: '24x7 Support', para: 'Assistance anytime, anywhere' },
  { icon: icon3, heading: 'Projects', para: 'Learn by doing with industry-focused tasks' },
  { icon: icon4, heading: 'Flexibility', para: 'Training that adapts to your schedule' },
  { icon: icon5, heading: 'Skill Tracking', para: 'Measure growth, boost performance' },
  { icon: icon6, heading: 'Certification', para: 'Validate skills, advance careers' },
];

const CustomizeTraining = () => {
  return (
    <div className="help-background">
      <div className="instructor-banner container">
        <div className="home-content">
          <h2 className="become-expert-title">Customized Corporate Training for Every Team</h2>
          <p className="home-title-text">
            Tailored online IT training solutions designed to fit your workforce needs — flexible, practical, and impact-driven
          </p>

          <div className='customized-column'>
            {features.map((item, index) => (
              <div className='customized-content' key={index}>
                <Image src={item.icon} alt={`${item.heading}-icon`} loading="lazy" />
                <div>
                  <p className='customized-content-heading'>{item.heading}</p>
                  <p className='customized-content-para'>{item.para}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="home-content">
          <Image src={training} alt='customized-training' className='key-image corporate-key-image' priority />
        </div>
      </div>
    </div>
  );
};

export default CustomizeTraining;
