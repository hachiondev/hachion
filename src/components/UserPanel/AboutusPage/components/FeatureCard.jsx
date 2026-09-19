import Image from "next/image";

const FeatureCard = ({ img, title, desc, alt }) => (
  <div className="about-feat-card">
    <Image src={img} alt={alt} />
    <div className="about-feat-title">{title}</div>
    <p className="about-feat-lable">{desc}</p>
  </div>
);

export default FeatureCard;
