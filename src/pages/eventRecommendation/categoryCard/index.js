import { Card } from "antd";

import "./style.scss";

const EventRecommendationCategoryCard = ({ category }) => {
  function openLink(url) {
    window.open(url, "_blank");
  }

  return (
    <Card
      bordered={false}
      className="event-recommendation-category-card"
      onClick={() => openLink(category.external_link)}
      cover={<img alt={category.title} src={category.picture_url} />}
    >
      <div className="overlay" />
      <p className="title text-3xl medium">{category.title}</p>
    </Card>
  );
};

export default EventRecommendationCategoryCard;
