import eventImg from "assets/images/event-recommendation-coming-soon.png";

const EventRecommendation = () => {
  return (
    <div className="event-recommendation-page max-container">
      <img src={eventImg} alt="Event" className="full-w-img" />
    </div>
  );
};

export default EventRecommendation;