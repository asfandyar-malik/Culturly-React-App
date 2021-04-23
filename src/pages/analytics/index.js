import { useEffect, useState } from "react";
import moment from "moment";
import { Card, Col, Row, Select, Progress, Space, DatePicker } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import {
  getWorkspaceTeams,
  getHappinessScore,
  getEngagementScore,
} from "actions";

import "./style.scss";

const Analytics = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [happinessScore, setHappinessScore] = useState({});
  const [engagementItems, setEngagementItems] = useState([]);
  const [selectedWeekDay, setSelectedWeekDay] = useState(moment());
  const [totalEngagementResponses, setTotalEngagementResponses] = useState(0);

  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
    });
  }, []);

  useEffect(() => {
    getHappinessScore(selectedTeam).then((response) => {
      setHappinessScore(response.data);
    });
  }, [selectedTeam]);

  useEffect(() => {
    const endTs = selectedWeekDay.endOf("week").format("X");
    const startTs = selectedWeekDay.startOf("week").format("X");
    getEngagementScore(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      setEngagementItems(data.questions);
      setTotalEngagementResponses(data.total_responses);
    });
  }, [selectedWeekDay, selectedTeam]);

  return (
    <div className="analytics-container">
      <Select
        value={selectedTeam}
        style={{ width: 300 }}
        placeholder="Select a team"
        onChange={(value) => setSelectedTeam(value)}
      >
        <Select.Option value="">All</Select.Option>
        {teams.map((item) => {
          return (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
      <Row>
        <Col span={24} className="mt-16">
          <Card title="Happiness score">
            <Row justify="space-between">
              <Col>
                <Progress
                  type="circle"
                  percent={happinessScore.current_week_score}
                />
              </Col>
              <Col>
                <div className="mb-12">
                  <span>How does score compare?</span>
                  <InfoCircleOutlined className="info-icon" />
                </div>
                <Space>
                  <Card>
                    <p className="text-xl medium">Last week</p>
                    <p className="text-5xl medium">
                      {happinessScore.last_week_score}%
                    </p>
                  </Card>
                  <Card>
                    <p className="text-xl medium">Avg. last month</p>
                    <p className="text-5xl medium">
                      {happinessScore.last_month_score}%
                    </p>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} className="mt-16">
          <Card
            title="Engagement score"
            extra={
              <DatePicker
                picker="week"
                style={{ width: 200 }}
                value={selectedWeekDay}
                placeholder="Select a week"
                onChange={(value) => setSelectedWeekDay(value)}
              />
            }
          >
            <Row justify="space-between" className="text-2xl">
              <Col>No of responses</Col>
              <Col className="font-medium">{totalEngagementResponses}</Col>
            </Row>
            {engagementItems.map((item, index) => {
              return (
                <Row justify="space-between" key={index} className="text-2xl">
                  <Col>{item.title}</Col>
                  <Col className="font-medium">{item.score}%</Col>
                </Row>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
