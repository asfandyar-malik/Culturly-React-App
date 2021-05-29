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
  Collapse,
} from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import {
  getWorkspaceTeams,
  getHappinessScore,
  getEngagementScore,
} from "actions";

import "./style.scss";

const Analytics = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [happinessScore, setHappinessScore] = useState({});
  const [engagementItems, setEngagementItems] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [overallCulureScore, setOverallCulureScore] = useState(0);

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
    let totalScore = 0;
    let totalResponses = 0;
    const endTs = selectedMonth.endOf("month").format("X");
    const startTs = selectedMonth.startOf("month").format("X");
    getEngagementScore(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      Object.keys(data.categories).forEach((key) => {
        (data.categories[key]?.questions || []).forEach((item) => {
          if (item.score) {
            totalResponses += 1;
            totalScore += item.score;
          }
        });
      });
      setLoading(false);
      setEngagementItems(data.categories);
      setTotalTeamMembers(data.total_team_members);
      setOverallCulureScore(totalResponses ? totalScore / totalResponses : 0);
    });
  }, [selectedMonth, selectedTeam]);

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
        <Select.Option value="">All Department"</Select.Option>
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
                  format={(percent) => `${percent}%`}
                  percent={formatValue(happinessScore.current_week_score)}
                />
              </Col>
              <Col>
                <div className="mb-12">
                  <span>How does score compare?</span>
                  <Tooltip title="You view here your happiness score from previous weeks and previous month">
                    <InfoCircleOutlined className="info-icon" />
                  </Tooltip>
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
            loading={loading}
            title={
              <Tooltip
                title="Engagement score is calcuated from the response to Culture check, which is a 
              weekly survey used to measure Engagement, Mood, Wellbeing, Collaboration, Impact."
              >
                <Space size={6}>
                  <span>Culture score</span>
                  <QuestionCircleOutlined />
                </Space>
              </Tooltip>
            }
            extra={
              <Space>
                <DatePicker
                  picker="month"
                  allowClear={false}
                  style={{ width: 200 }}
                  value={selectedMonth}
                  placeholder="Select a month"
                  onChange={(value) => setSelectedMonth(value)}
                />
              </Space>
            }
          >
            <Row justify="space-between overall-row" className="text-2xl mb-12">
              <Col className="font-medium">Overall culture score</Col>
              <Col className="font-medium">
                <Badge
                  color={getBadgeColor(overallCulureScore)}
                  text={`${formatValue(overallCulureScore)}%`}
                />
              </Col>
            </Row>
            <Collapse bordered={false}>
              {Object.keys(engagementItems).map((key) => {
                const categoryData = engagementItems[key];
                const meanScore = categoryData.mean_response || 0;
                return (
                  <Collapse.Panel
                    key={key}
                    header={key}
                    extra={
                      <Badge
                        color={getBadgeColor(meanScore)}
                        text={`${formatValue(meanScore)}%`}
                      />
                    }
                    className="site-collapse-custom-panel"
                  >
                    <Row justify="space-between" className="text-xl mb-4">
                      <Col>Total no. of responses</Col>
                      <Col className="font-medium">
                        {categoryData.total_responses || 0}
                      </Col>
                    </Row>
                    <Row justify="space-between" className="text-xl mb-4">
                      <Col>Number of people answering</Col>
                      <Col className="font-medium">{`${
                        categoryData.total_member_responses || 0
                      }/${totalTeamMembers}`}</Col>
                    </Row>
                    {(categoryData?.questions || []).map((item) => {
                      const { score } = item;
                      return (
                        <Row
                          key={item.question_id}
                          justify="space-between"
                          className="text-xl mb-4"
                        >
                          <Col>{item.title}</Col>
                          <Col className="font-medium">
                            {score ? (
                              <Badge
                                color={getBadgeColor(score)}
                                text={`${formatValue(score)}%`}
                              />
                            ) : (
                              "NA"
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
