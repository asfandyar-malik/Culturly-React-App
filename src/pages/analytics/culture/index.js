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
  Progress,
} from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import {
  LINE_CHART_OPTIONS,
  LINE_COUNT_CHART_OPTIONS,
  CATEGORY_GRAPH_COLOR,
  MULTIPLE_LINE_CHART_OPTIONS,
} from "../../../constants";
import {
  getWeeksInMonth,
  disabledFutureDate,
  getMonthsBetweenDates,
} from "utils";
import {
  getCultureScore,
  getCultureScorePerCategory,
  getCultureGraph,
  getAllCultureGraph,
} from "actions";

const CultureAnalyticsCard = ({ categories, selectedTeam }) => {
  const cultureChartRef = useRef(null);
  const allCultureChartRef = useRef(null);
  const cultureCountChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [cultureScore, setCultureScore] = useState({});
  const [cultureItems, setCultureItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [overallcultureScore, setOverallcultureScore] = useState(0);
  const [cultureGraphMonth, setcultureGraphMonth] = useState(moment());
  const [cultureGraphData, setCultureGraphData] = useState([]);
  const [allCultureGraphData, setAllCultureGraphData] = useState([]);
  const [cultureChartElement, setCultureChartElement] = useState("");
  const [cultureCountChartElement, setCultureCountChartElement] = useState("");
  const [allCultureChartElement, setAllCultureChartElement] = useState("");

  useEffect(() => {
    getCultureScore(selectedTeam).then((response) => {
      setCultureScore(response.data);
    });
  }, [selectedTeam]);

  useEffect(() => {
    let totalScore = 0;
    let totalResponses = 0;
    const endTs = cultureGraphMonth.endOf("month").format("X");
    const startTs = cultureGraphMonth.startOf("month").format("X");

    getCultureScorePerCategory(selectedTeam, startTs, endTs).then(
      (response) => {
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
        setCultureItems(data.categories);
        setTotalTeamMembers(data.total_team_members);
        setOverallcultureScore(
          totalResponses ? totalScore / totalResponses : 0
        );
      }
    );
  }, [cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    let endTs = moment().endOf("month").utc(true).format("X");
    let startTs = moment()
      .subtract(1, "years")
      .startOf("month")
      .utc(true)
      .format("X");
    if (cultureGraphMonth) {
      endTs = cultureGraphMonth.endOf("month").utc(true).format("X");
      startTs = cultureGraphMonth.startOf("month").utc(true).format("X");
    }
    getCultureGraph(selectedTeam, startTs, endTs, selectedCategory).then(
      (response) => {
        setCultureGraphData(response.data);
      }
    );
  }, [selectedCategory, cultureGraphMonth]);

  useEffect(() => {
    let endTs = moment().endOf("month").utc(true).format("X");
    let startTs = moment()
      .subtract(1, "years")
      .startOf("month")
      .utc(true)
      .format("X");

    if (cultureGraphMonth) {
      endTs = cultureGraphMonth.endOf("month").utc(true).format("X");
      startTs = cultureGraphMonth.startOf("month").utc(true).format("X");
    }

    getAllCultureGraph(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      const allDataSets = [];
      let labels = new Set();
      console.log("All data results: " + data.categories["all"].results)

      setAllCultureGraphData(data.categories["all"].results);

      Object.keys(data.categories).forEach((key) => {
        console.log("-------------------------------");
        const dataPoints = [];

        if (cultureGraphMonth) {
          const weeks = getWeeksInMonth(
            cultureGraphMonth.format("YYYY"),
            cultureGraphMonth.format("M")
          );

          if (data.categories[key].results.length) {
            weeks.forEach((week) => {
              const item =
                data.categories[key].results.find(
                  (i) => moment(i.week).format("D") === week.startDay
                ) || {};

              labels.add(week.weekName);
              dataPoints.push(item.avg || 0);
            });
          }
        }

        const dataset = {
          fill: true,
          label: key,
          data: dataPoints,
          borderColor: CATEGORY_GRAPH_COLOR[key],
          backgroundColor: "#27cdec02",
        };

        allDataSets.push(dataset);
      });

      if (allCultureChartElement) {
        allCultureChartElement.destroy();
      }

      if (allCultureGraphData) {

        const chartAllCultureRef = allCultureChartRef.current.getContext("2d");

        const allLineChart = new Chart(chartAllCultureRef, {
          type: "line",
          data: {
            labels: Array.from(labels),
            datasets: allDataSets,
          },
          options: MULTIPLE_LINE_CHART_OPTIONS,
        });
        setAllCultureChartElement(allLineChart);
      }
    });
  }, [cultureGraphMonth]);

  useEffect(() => {
    if (cultureChartElement) {
      cultureChartElement.destroy();
    }
    if (cultureCountChartElement) {
      cultureCountChartElement.destroy();
    }

    if (cultureGraphData.length) {
      const labels = [];
      const dataPoints = [];
      const dataPointsCounts = [];
      const dataPointsUniqueUserCounts = [];

      const chartRef = cultureChartRef.current.getContext("2d");
      const countChartRef = cultureCountChartRef.current.getContext("2d");

      if (cultureGraphMonth) {
        const weeks = getWeeksInMonth(
          cultureGraphMonth.format("YYYY"),
          cultureGraphMonth.format("M")
        );
        weeks.forEach((week) => {
          const item =
            cultureGraphData.find(
              (i) => moment(i.week).format("D") === week.startDay
            ) || {};

          labels.push(week.weekName);
          dataPoints.push(item.avg || 0);
          dataPointsCounts.push(item.count || 0);
          dataPointsUniqueUserCounts.push(item.uniqueUsers || 0);
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
          dataPointsCounts.push(item.count || 0);
          dataPointsUniqueUserCounts.push(item.uniqueUsers || 0);
        });
      }

      const lineChart = new Chart(chartRef, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              fill: true,
              label: "Culture Score",
              data: dataPoints,
              borderColor: "#30CAEC",
              backgroundColor: "#f0ffff87",
            },
          ],
        },
        options: LINE_CHART_OPTIONS,
      });

      const countLineChart = new Chart(countChartRef, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              fill: true,
              label: "Number of responses",
              data: dataPointsCounts,
              borderColor: "#7d68eb",
              backgroundColor: "#7d68eb67",
            },
            {
              fill: true,
              label: "Number of People answering",
              data: dataPointsUniqueUserCounts,
              borderColor: "#30CAEC",
              backgroundColor: "#30CAEC67",
            },
          ],
        },
        options: LINE_COUNT_CHART_OPTIONS,
      });

      setCultureChartElement(lineChart);
      setCultureCountChartElement(countLineChart);
    }
  }, [cultureGraphData]);

  function formatValue(val) {
    return val ? parseFloat(val.toFixed(2)) : val;
  }

  function getBadgeColor(val) {
    let color = "#19AF19";
    if (val < 33.3) {
      color = "#E11919";
    }
    if (val > 33.4 && val < 66.6) {
      color = "#FEAF00";
    }
    return color;
  }

  return (
    <Row>
      <Col span={24} className="mt-16 culture-col">
        <Card
          title={
            <Tooltip
              title="Culture Score is calculated from Weekly Survey checks. Weekly survey checks are sent
              4 times a month and include 9 questions in total in 8 different Culture categories.  "
            >
              <Space size={6}>
                <span>Culture score</span>
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
                percent={formatValue(cultureScore.current_month_score)}
              />
            </Col>
            <Col>
              <div className="mb-12">
                <span>How does score compare?</span>
                <Tooltip title="You view here your Culture score from previous months">
                  <InfoCircleOutlined className="info-icon" />
                </Tooltip>
              </div>
              <Space>
                <Card>
                  <p className="text-xl medium">Avg. last month</p>
                  <p className="text-5xl medium">
                    {formatValue(cultureScore.last_month_score)}%
                  </p>
                </Card>
              </Space>
            </Col>
          </Row>
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
                value={cultureGraphMonth}
                disabledDate={disabledFutureDate}
                onChange={(value) => setcultureGraphMonth(value)}
              />
            </Space>
          }
        >
          <div>
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
          </div>
        </Card>

        <Card>
          <Tooltip title="Response rate shows us the frequency of inputted information by team members. ">
            <Space size={6}>
              <span>All Culture Categories</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>

          <br></br>
          <br></br>

          <div>
            <Choose>
              <When condition={allCultureGraphData}>
                <canvas ref={allCultureChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Empty description="No data available to display" />
                </div>
              </Otherwise>
            </Choose>
          </div>
        </Card>

        <Card>
          <Tooltip title="Response rate shows us the frequency of inputted information by team members. ">
            <Space size={6}>
              <span>Response Rate</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>

          <br></br>
          <br></br>

          <div>
            <Choose>
              <When condition={cultureGraphData.length}>
                <canvas ref={cultureCountChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Empty description="No happiness rate available to display" />
                </div>
              </Otherwise>
            </Choose>
          </div>
        </Card>

        <br></br>
        <br></br>
        <br></br>
        <Card
          loading={loading}
          title={
            <Tooltip
              title="Culturly score is calcuated from the response to Culture Check, which is a 
              weekly survey used to measure Engagement, Mood, Wellbeing, Collaboration, Impact."
            >
              <Space size={6}>
                <span>Culture score</span>
                <QuestionCircleOutlined />
              </Space>
            </Tooltip>
          }
        >
          <Row justify="space-between overall-row" className="text-2xl mb-12">
            <Col className="font-medium">Overall culture score</Col>
            <Col className="font-medium">
              <Badge
                color={getBadgeColor(overallcultureScore)}
                text={`${formatValue(overallcultureScore)}%`}
              />
            </Col>
          </Row>
          <Collapse bordered={false}>
            {Object.keys(cultureItems).map((key) => {
              const categoryData = cultureItems[key];
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
        <br></br>
        <br></br>
      </Col>
    </Row>
  );
};

export default CultureAnalyticsCard;
