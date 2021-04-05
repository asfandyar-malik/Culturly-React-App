import { useEffect, useState } from "react";
import { Button, Card, Col, Badge, Row, Tag } from "antd";

import { getEventRecommendations } from "actions";

import "./style.scss";

const RecommendationItem = ({ item }) => {
  return (
    <div className="item">
      <div
        className="image"
        style={{ backgroundImage: `url(${item.picture_url})` }}
      />
      <div className="detail">
        <p className="text-xl secondary title mb-8">{item.title}</p>
        {item.tags.map((tag) => {
          return (
            <Tag color="red" key={tag.slug}>
              {tag.name}
            </Tag>
          );
        })}
        <div>
          <Button type="ghost" className="mt-12">
            <a href={item.external_link} target="_blank">
              View more
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventRecommendation = () => {
  const [loading, setLoading] = useState(true);
  const [eventRecommendations, setEventRecommendations] = useState([]);
  useEffect(() => {
    getEventRecommendations().then((response) => {
      setLoading(false);
      setEventRecommendations(response.data);
    });
  }, []);

  return (
    <Card
      bordered={0}
      loading={loading}
      className="no-padding event-recommendations"
    >
      <Row gutter={16}>
        {eventRecommendations.map((item, index) => {
          return (
            <Col span={8} key={index}>
              <Choose>
                <When condition={item.is_premium}>
                  <Badge.Ribbon
                    text="PREMIUM"
                    color="#30CAEC"
                    placement="start"
                  >
                    <RecommendationItem item={item} />
                  </Badge.Ribbon>
                </When>
                <Otherwise>
                  <RecommendationItem item={item} />
                </Otherwise>
              </Choose>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default EventRecommendation;
