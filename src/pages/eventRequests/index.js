import { useEffect, useState } from "react";
import { Col, List, Row } from "antd";
import dayjs from "dayjs";

import { getEventRequests } from "actions";

const EventRequests = () => {
  const [loading, setLoading] = useState(true);
  const [eventRequests, setEventRequests] = useState([]);
  useEffect(() => {
    getEventRequests().then((response) => {
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
          <Col span={5}>Conf Tool</Col>
        </Row>
      }
      renderItem={(item) => (
        <List.Item>
          <Row gutter={32} className="font-medium">
            <Col span={5}>{item.event_name}</Col>
            <Col span={4}>{item.event_language}</Col>
            <Col span={5}>{item.event_participants}</Col>
            <Col span={4}>{dayjs(item.event_date).format("DD-MMM-YYYY")}</Col>
            <Col span={5}>{item.conferencing_tools.join(", ")}</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default EventRequests;
