import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Space, Button, Card } from "antd";

import { getEvents } from "actions";
import { getEventCover } from "utils";
import { getEventDetailRoute } from "routes";

const Events = () => {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getEvents().then((response) => {
      setEvents(response.data.results);
    });
  }, []);

  function onRegister(eventSlug) {
    history.push(getEventDetailRoute(eventSlug));
  }

  return (
    <div className="events-listing">
      <Space size={24}>
        {events.map((event) => {
          return (
            <Card
              key={event.slug}
              className="event-list-card"
              cover={<img alt={event.title} src={getEventCover(event)} />}
            >
              <p className="text-2xl medium">{event.title}</p>
              <p className="mt-8 description">{event.detail.description}</p>
              <Button
                type="primary"
                className="mt-12"
                onClick={() => onRegister(event.slug)}
              >
                Register
              </Button>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default Events;
