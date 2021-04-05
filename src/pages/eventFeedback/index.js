import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";

import { getEventFeedback } from "actions";

const EventFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackItems, setFeedbackIems] = useState([]);
  useEffect(() => {
    getEventFeedback().then((response) => {
      setLoading(false);
      setFeedbackIems(response.data);
    });
  }, []);

  return (
    <List
      loading={loading}
      className="common-list"
      dataSource={feedbackItems}
      header={
        <Row gutter={32}>
          <Col span={8}>Event</Col>
          <Col span={4}>Rating</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item>
          <Row gutter={32} className="font-medium">
            <Col span={8}>{item.title}</Col>
            <Col span={4}>{item.rating}/5</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default EventFeedback;
