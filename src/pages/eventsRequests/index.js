import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";
import dayjs from "dayjs";

import { getUserBookings } from "actions";

const EventRequests = () => {
  const [loading, setLoading] = useState(true);
  const [eventRequests, setEventRequests] = useState([]);

  useEffect(() => {
    getUserBookings().then((response) => {
      setLoading(false);
      setEventRequests(response.data.results);
    });
  }, []);

  return (
    <List
      loading={loading}
      className="common-list"
      dataSource={eventRequests}
      header={
        <Row gutter={32}>
          <Col span={5}>Event Name</Col>
          <Col span={4}>Language</Col>
          <Col span={5}>No of Participants</Col>
          <Col span={4}>Date</Col>
          <Col span={5}>Estimated total</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item>
          <Row gutter={32} className="font-medium">
            <Col span={5}>{item.event.title}</Col>
            <Col span={4}>{item.event.language}</Col>
            <Col span={5}>{item.participants_count}</Col>
            <Col span={4}>
              <p>{dayjs(item.preferred_date).format("DD-MMM-YYYY")}</p>
              <p>{item.timezone}</p>
            </Col>
            <Col span={5}>€{item.estimated_total}</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default EventRequests;
