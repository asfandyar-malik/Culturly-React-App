import { useEffect, useState } from "react";
import moment from "moment";
import {
  Card,
  Col,
  Row,
  Select,
  Progress,
  Space,
  DatePicker,
  Tooltip,
  Badge,
} from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import {
  getWorkspaceTeams,
  getHappinessScore,
  getEngagementScore,
  getSurveyQuestionCategories,
} from "actions";

import "./style.scss";

const Analytics = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [happinessScore, setHappinessScore] = useState({});
  const [engagementItems, setEngagementItems] = useState([]);
  const [selectedWeekDay, setSelectedWeekDay] = useState(moment());
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [totalResponseMembers, setTotalResponseMembers] = useState(0);
  const [totalEngagementResponses, setTotalEngagementResponses] = useState(0);

  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
    });
    getSurveyQuestionCategories().then((response) => {
      const { data } = response;
      setCategories(data);
      if (data.length) {
        setSelectedCategory(data[0].slug);
      }
    });
  }, []);

  useEffect(() => {
    getHappinessScore(selectedTeam).then((response) => {
      setHappinessScore(response.data);
    });
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedCategory) {
      const endTs = selectedWeekDay.endOf("week").format("X");
      const startTs = selectedWeekDay.startOf("week").format("X");
      getEngagementScore(selectedTeam, selectedCategory, startTs, endTs).then(
        (response) => {
          const { data } = response;
          setEngagementItems(data.questions);
          setTotalTeamMembers(data.total_team_members);
          setTotalEngagementResponses(data.total_responses);
          setTotalResponseMembers(data.total_response_members);
        }
      );
    }
  }, [selectedWeekDay, selectedTeam, selectedCategory]);

  function formatValue(val) {
    return val ? parseFloat(val.toFixed(2)) : val;
  }

  function getBadgeColor(val) {
    let color = "#19AF19";
    if (val < 40) {
      color = "#E11919";
    }
    if (val > 40 && val < 80) {
      color = "#FEAF00";
    }
    return color;
  }

  return (
    <div className="analytics-container max-container">
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
        <Col span={24} className="mt-16 happiness-col">
          <Card
            title={
              <Tooltip
                title="Happiness score is calculated from Mood Check survey. Mood check is 
              sent daily to each team member asking them, how they are feeling "
              >
                <Space size={6}>
                  <span>Happiness score</span>
                  <QuestionCircleOutlined />
                </Space>
              </Tooltip>
            }
          >
            <Row justify="space-between">
              <Col>
                <Progress
                  type="circle"
                  percent={formatValue(happinessScore.current_week_score)}
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
                      {formatValue(happinessScore.last_week_score)}%
                    </p>
                  </Card>
                  <Card>
                    <p className="text-xl medium">Avg. last month</p>
                    <p className="text-5xl medium">
                      {formatValue(happinessScore.last_month_score)}%
                    </p>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} className="mt-16">
          <Card
            title={
              <Tooltip
                title="Engagement score is calcuated from the response to Pulse Check, which is a 
              weekly survey used to measure Engagement, Mood, Wellbeing, Collaboration, Impact."
              >
                <Space size={6}>
                  <span>Engagement score</span>
                  <QuestionCircleOutlined />
                </Space>
              </Tooltip>
            }
            extra={
              <Space>
                <Select
                  value={selectedCategory}
                  style={{ width: "20rem" }}
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {categories.map((item) => {
                    return (
                      <Select.Option key={item.slug} value={item.slug}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
                <DatePicker
                  picker="week"
                  allowClear={false}
                  style={{ width: 200 }}
                  value={selectedWeekDay}
                  placeholder="Select a week"
                  onChange={(value) => setSelectedWeekDay(value)}
                />
              </Space>
            }
          >
            <Row justify="space-between" className="text-2xl">
              <Col>No of responses</Col>
              <Col className="font-medium">{totalEngagementResponses}</Col>
            </Row>
            <Row justify="space-between" className="text-2xl">
              <Col>Number of people engaging</Col>
              <Col className="font-medium">{`${totalResponseMembers}/${totalTeamMembers}`}</Col>
            </Row>
            {engagementItems.map((item, index) => {
              return (
                <Row justify="space-between" key={index} className="text-2xl">
                  <Col>{item.title}</Col>
                  <Col className="font-medium">
                    <Badge
                      color={getBadgeColor(item.score)}
                      text={`${formatValue(item.score)}%`}
                    />
                  </Col>
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
