import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Space, Button, Card, Tag } from "antd";

import { getEventDetailRoute } from "routes";
import { getEvents, getEventCategories } from "actions";

import "./style.scss";

const Events = () => {
  const history = useHistory();

  const [events, setEvents] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const queryParams = {
      page: 1,
      page_size: 20,
      ...(selectedCategories.length
        ? {
            categories__slug__in: selectedCategories.join(","),
          }
        : {}),
    };
    const queryString = new URLSearchParams(queryParams).toString();
    getEventCategories().then((response) => {
      setEventCategories(response.data);
    });
    getEvents(queryString).then((response) => {
      setEvents(response.data.results);
    });
  }, [selectedCategories]);

  function onRegister(eventSlug) {
    history.push(getEventDetailRoute(eventSlug));
  }

  function onCategorySelect(categorySlug) {
    const index = selectedCategories.indexOf(categorySlug);
    if (index === -1) {
      if (categorySlug === "all") {
        setSelectedCategories([]);
      } else {
        selectedCategories.push(categorySlug);
        setSelectedCategories([...selectedCategories]);
      }
    } else {
      if (selectedCategories.length === 1) {
        setSelectedCategories([]);
      } else {
        selectedCategories.splice(index, 1);
        setSelectedCategories([...selectedCategories]);
      }
    }
  }

  return (
    <div className="events-listing">
      <If condition={eventCategories.length > 1}>
        <div className="mb-24 categories-filter">
          <p className="text-2xl semi-bold mb-4">Filter by categories</p>
          <Tag
            key="all"
            onClick={() => onCategorySelect("all")}
            className={!selectedCategories.length ? "selected" : ""}
          >
            All categories
          </Tag>
          {eventCategories.map((item) => {
            const { slug } = item;
            return (
              <Tag
                key={slug}
                onClick={() => onCategorySelect(slug)}
                className={selectedCategories.includes(slug) ? "selected" : ""}
              >
                {item.name}
              </Tag>
            );
          })}
        </div>
      </If>
      <Space size={24}>
        {events.map((event) => {
          return (
            <Card
              key={event.slug}
              className="event-list-card"
              cover={<img alt={event.title} src={event.cover_picture_url} />}
            >
              <p className="text-2xl medium">{event.title}</p>
              <p className="mt-8 description">{event.detail.description}</p>
              <Button
                type="primary"
                className="mt-12"
                onClick={() => onRegister(event.slug)}
              >
                Book now
              </Button>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default Events;
