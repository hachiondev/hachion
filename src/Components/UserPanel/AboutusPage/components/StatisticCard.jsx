const StatisticCard = ({ image, number, label, alt }) => (
  <div className="expert-content">
    <img src={image} alt={alt} />
    <div className="expert-sub-content">
      <div className="about-number">{number}</div>
      <p className="about-label">{label}</p>
    </div>
  </div>
);

export default StatisticCard;