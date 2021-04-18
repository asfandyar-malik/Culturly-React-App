import { Card, Badge, Tag } from "antd";

import "./style.scss";

const EventCard = ({ event }) => {
  function openLink(url) {
    window.open(url, "_blank");
  }

  return (
    <Card
      bordered={false}
      className="event-recommendation-event-card"
      onClick={() => openLink(event.external_link)}
      cover={<img alt={event.title} src={event.picture_url} />}
    >
      <p className="title text-base medium secondary">{event.title}</p>
      {event.tags.map((tag) => {
        return <Tag key={tag.slug}>{tag.name}</Tag>;
      })}
    </Card>
  );
};

const EventRecommendationEventCard = ({ event }) => {
  return (
    <Choose>
      <When condition={event.is_premium}>
        <Badge.Ribbon text="PREMIUM" color="#30CAEC" placement="start">
          <EventCard event={event} />
        </Badge.Ribbon>
      </When>
      <Otherwise>
        <EventCard event={event} />
      </Otherwise>
    </Choose>
  );
};

export default EventRecommendationEventCard;
