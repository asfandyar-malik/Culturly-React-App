import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";

import { getEventsFeedback } from "actions";

const EventFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackItems, setFeedbackIems] = useState([]);
  useEffect(() => {
    getEventsFeedback().then((response) => {
      setLoading(false);
      setFeedbackIems(response.data);
    });
  }, []);

  return (
    <List
      loading={loading}
      dataSource={feedbackItems}
      className="common-list max-container"
      header={
        <Row gutter={32}>
          <Col span={12}>Event</Col>
          <Col span={6}>Rating</Col>
          <Col span={6}>Event date</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item>
          <Row gutter={32} className="font-medium">
            <Col span={12}>{item.title}</Col>
            <Col span={6}>{item.rating}/5</Col>
            <Col span={6}>{item.event_date}</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default EventFeedback;
