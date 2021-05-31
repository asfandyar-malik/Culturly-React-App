import moment from "moment";
import Chart from "chart.js/auto";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  DatePicker,
  Tooltip,
  Badge,
  Collapse,
  Select,
  Empty,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { LINE_CHART_OPTIONS } from "../../../constants";
import {
  getWeeksInMonth,
  disabledFutureDate,
  getMonthsBetweenDates,
} from "utils";
import { getEngagementScore, getEngagementGraph } from "actions";

const CultureAnalyticsCard = ({ categories, selectedTeam }) => {
  const cultureChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [engagementItems, setEngagementItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [overallCulureScore, setOverallCulureScore] = useState(0);
  const [culureGraphMonth, setCulureGraphMonth] = useState(moment());
  const [cultureGraphData, setCultureGraphData] = useState([]);
  const [cultureChartElement, setCultureChartElement] = useState("");

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

  useEffect(() => {
    let endTs = moment().endOf("month").format("X");
    let startTs = moment().subtract(1, "years").startOf("month").format("X");
    if (culureGraphMonth) {
      endTs = culureGraphMonth.endOf("month").format("X");
      startTs = culureGraphMonth.startOf("month").format("X");
    }
    getEngagementGraph(selectedTeam, startTs, endTs, selectedCategory).then(
      (response) => {
        setCultureGraphData(response.data);
      }
    );
  }, [selectedCategory, culureGraphMonth]);

  useEffect(() => {
    if (cultureChartElement) {
      cultureChartElement.destroy();
    }
    if (cultureGraphData.length) {
      const labels = [];
      const dataPoints = [];
      const chartRef = cultureChartRef.current.getContext("2d");

      if (culureGraphMonth) {
        const weeks = getWeeksInMonth(
          culureGraphMonth.format("YYYY"),
          culureGraphMonth.format("M")
        );
        weeks.forEach((week) => {
          const item =
            cultureGraphData.find(
              (i) => moment(i.week).format("D") === week.startDay
            ) || {};
          labels.push(week.weekName);
          dataPoints.push(item.avg || 0);
        });
      } else {
        const months = getMonthsBetweenDates(
          moment().subtract(1, "years").startOf("month"),
          moment().endOf("month")
        );
        months.forEach((month) => {
          const item =
            cultureGraphData.find(
              (i) =>
                moment(i.month).format("MM-YYYY") ===
                moment(month).format("MM-YYYY")
            ) || {};
          labels.push(moment(month).format("MMM YYYY"));
          dataPoints.push(item.avg || 0);
        });
      }

      const lineChart = new Chart(chartRef, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              fill: true,
              label: "Score",
              data: dataPoints,
              borderColor: "#30CAEC",
              backgroundColor: "#f0ffff87",
            },
          ],
        },
        options: LINE_CHART_OPTIONS,
      });
      setCultureChartElement(lineChart);
    }
  }, [cultureGraphData]);

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
    <Row>
      <Col span={24} className="mt-16">
        <Card
          loading={loading}
          title={
            <Tooltip
              title="Engagement score is calcuated from the response to Culture Check, which is a 
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
                value={selectedMonth}
                style={{ width: 200 }}
                placeholder="Select a month"
                disabledDate={disabledFutureDate}
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
        <Card
          className="no-header-border"
          extra={
            <Space size={16}>
              <Select
                style={{ width: 175 }}
                value={selectedCategory}
                placeholder="Select a category"
                onChange={(value) => setSelectedCategory(value)}
              >
                <Select.Option value="">All</Select.Option>
                {categories.map((item) => {
                  return (
                    <Select.Option value={item.slug} key={item.slug}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
              <DatePicker
                format="MMM"
                picker="month"
                style={{ width: 200 }}
                value={culureGraphMonth}
                disabledDate={disabledFutureDate}
                onChange={(value) => setCulureGraphMonth(value)}
              />
            </Space>
          }
        >
          <Choose>
            <When condition={cultureGraphData.length}>
              <canvas ref={cultureChartRef} height={320} />
            </When>
            <Otherwise>
              <div className="empty-container vertical-center">
                <Empty description="No data available to display" />
              </div>
            </Otherwise>
          </Choose>
        </Card>
      </Col>
    </Row>
  );
};

export default CultureAnalyticsCard;
