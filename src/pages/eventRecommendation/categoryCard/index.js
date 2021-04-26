import "./style.scss";

const EventRecommendationCategoryCard = ({ category }) => {
  function openLink(url) {
    window.open(url, "_blank");
  }

  return (
    <div
      className="event-recommendation-category-card"
      onClick={() => openLink(category.external_link)}
    >
      <div
        className="cover"
        style={{ backgroundImage: `url(${category.picture_url})` }}
      />
      <p className="title text-2xl medium">{category.title}</p>
    </div>
  );
};

export default EventRecommendationCategoryCard;
