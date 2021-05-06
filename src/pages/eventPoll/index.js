import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";

import { getEventsPoll } from "actions";

import "./style.scss";

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
      className="common-list max-container event-poll-list"
      header={
        <Row gutter={32}>
          <Col span={16}>Event</Col>
          <Col span={8}>Date</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item className="parent-list-item">
          <Row gutter={32} className="font-medium">
            <Col span={16}>{item.title}</Col>
            <Col span={8}>{item.poll_date}</Col>
          </Row>
          <div>
            <List
              className="common-list"
              dataSource={item.responses || []}
              renderItem={(responseItem) => (
                <List.Item>
                  <Row gutter={32} className="font-medium">
                    <Col span={16}>{responseItem.title}</Col>
                    <Col span={8}>{responseItem.count} vote(s)</Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </List.Item>
      )}
    />
  );
};

export default EventPoll;
