import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";

import { getEventsPoll } from "actions";

const EventPoll = () => {
  const [loading, setLoading] = useState(true);
  const [eventItems, setEventItems] = useState([]);
  useEffect(() => {
    getEventsPoll().then((response) => {
      setLoading(false);
      setEventItems(response.data);
    });
  }, []);

  return (
    <List
      loading={loading}
      dataSource={eventItems}
      className="common-list max-container"
      header={
        <Row gutter={32}>
          <Col span={16}>Event</Col>
          <Col span={8}>Vote(s)</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item>
          <Row gutter={32} className="font-medium">
            <Col span={16}>{item.title}</Col>
            <Col span={8}>{item.count} vote(s)</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default EventPoll;
