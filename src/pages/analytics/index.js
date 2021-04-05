import comingSoonImg from "assets/images/coming_soon.svg";

const Analytics = () => {
  return (
    <div className="vertical-center">
      <div className="text-center">
        <img src={comingSoonImg} className="mb-32" />
        <p className="text-5xl medium mb-8">Coming Soon</p>
        <p className="text-base secondary">
          Our Team Is Currently Working Hard Building This Feature
        </p>
      </div>
    </div>
  );
};

export default Analytics;
