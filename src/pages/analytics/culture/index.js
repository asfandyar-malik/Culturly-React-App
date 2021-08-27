/* eslint-disable react-hooks/exhaustive-deps */
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
  Empty,
  Progress,
  Popover,
  Button,
  Checkbox,
  message,
  Radio,
} from "antd";
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  CaretDownOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

import {
  LINE_COUNT_CHART_OPTIONS,
  CATEGORY_GRAPH_COLOR,
  MULTIPLE_LINE_CHART_OPTIONS,
  BAR_CHART_OPTION,
  CATEGORY_GRAPH_LABEL,
  BAR_GRAPH_BACKGROUND_COLORS,
  BAR_GRAPH_BORDER_COLORS,
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

const CultureAnalyticsCard = ({ categories = [], selectedTeam }) => {
  const allCultureChartRef = useRef(null);
  const cultureCountChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [cultureScore, setCultureScore] = useState({});
  const [cultureItems, setCultureItems] = useState({});
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [overallcultureScore, setOverallcultureScore] = useState(0);
  const [cultureGraphMonth, setcultureGraphMonth] = useState(moment());
  const [cultureGraphData, setCultureGraphData] = useState([]);
  const [allCultureGraphData, setAllCultureGraphData] = useState([]);
  const [cultureCountChartElement, setCultureCountChartElement] = useState("");
  const [allCultureChartElement, setAllCultureChartElement] = useState("");
  const [cultureGraphFilter, setCultureGraphFilter] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [disableGraphDropdown, setDisableGraphDropdown] = useState(false);

  useEffect(() => {
    setCultureGraphFilter(["Average"]);
  }, [categories]);

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
    getCultureGraph(selectedTeam, startTs, endTs, "").then((response) => {
      setCultureGraphData(response.data);
    });
  }, [cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    if (allCultureGraphData.categories) {
      const allDataSets = [];
      let labels = new Set();

      if (allCultureChartElement) {
        allCultureChartElement.destroy();
      }
      Object.keys(allCultureGraphData.categories).forEach((key) => {
        const dataPoints = [];

        if (cultureGraphMonth) {
          const weeks = getWeeksInMonth(
            cultureGraphMonth.format("YYYY"),
            cultureGraphMonth.format("M")
          );

          if (allCultureGraphData.categories[key].results.length) {
            weeks.forEach((week) => {
              const item =
                allCultureGraphData.categories[key].results.find(
                  (i) => moment(i.week).format("D") === week.startDay
                ) || {};

              item.avg && labels.add(week.weekName);
              item.avg && dataPoints.push(item.avg);
            });
          }
        }

        const lineDataset = {
          fill: true,
          label: CATEGORY_GRAPH_LABEL[key],
          data: dataPoints,
          borderColor: CATEGORY_GRAPH_COLOR[key],
          pointBackgroundColor: CATEGORY_GRAPH_COLOR[key],
          backgroundColor: "#27cdec02",
        };

        const chartDataset = {
          fill: true,
          label: CATEGORY_GRAPH_LABEL[key],
          data: dataPoints,
          borderColor: BAR_GRAPH_BORDER_COLORS[key],
          backgroundColor: BAR_GRAPH_BACKGROUND_COLORS[key],
          borderWidth: 1,
          barThickness: 15,
        };

        allDataSets.push(chartType === "line" ? lineDataset : chartDataset);
      });

      labels.size === 1 && setChartType("bar");
      setDisableGraphDropdown(labels.size === 1);

      const chartAllCultureRef = allCultureChartRef.current.getContext("2d");

      const allLineChart = new Chart(chartAllCultureRef, {
        type: chartType,
        data: {
          labels: Array.from(labels),
          datasets: allDataSets.filter((d) => {
            if (d.label === "All Graphs") {
              return cultureGraphFilter.includes("Average");
            } else {
              return cultureGraphFilter.includes(d.label);
            }
          }),
        },
        options:
          chartType === "line" ? MULTIPLE_LINE_CHART_OPTIONS : BAR_CHART_OPTION,
      });
      setAllCultureChartElement(allLineChart);
    }
  }, [cultureGraphFilter, cultureGraphMonth, allCultureGraphData, chartType]);

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

    message.loading({ content: "Loading data...", key: "loader" });

    getAllCultureGraph(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      setAllCultureGraphData(data);
      message.success({ content: "Data loaded successfully", key: "loader" });
    });
  }, [cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    if (cultureCountChartElement) {
      cultureCountChartElement.destroy();
    }

    if (cultureGraphData.length) {
      const labels = [];
      const dataPoints = [];
      const dataPointsCounts = [];
      const dataPointsUniqueUserCounts = [];

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

          item.avg && labels.push(week.weekName);
          item.avg && dataPoints.push(item.avg);
          item.count && dataPointsCounts.push(item.count);
          item.uniqueUsers && dataPointsUniqueUserCounts.push(item.uniqueUsers);
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
          item.avg && dataPoints.push(item.avg);
          item.count && dataPointsCounts.push(item.count);
          item.uniqueUsers && dataPointsUniqueUserCounts.push(item.uniqueUsers);
        });
      }

      const countLineChart = new Chart(countChartRef, {
        type: chartType,
        data: {
          labels,
          datasets: [
            {
              fill: true,
              label: "Number of responses",
              data: dataPointsCounts,
              borderColor: "#7d68eb",
              pointBackgroundColor: "#7d68eb",
              backgroundColor: "rgba(125, 104, 235, 0.4)",
              borderWidth: 1,
              barThickness: 15,
            },
            {
              fill: true,
              label: "Number of People answering",
              data: dataPointsUniqueUserCounts,
              borderColor: "#30CAEC",
              pointBackgroundColor: "#30CAEC",
              backgroundColor: "rgba(48, 202, 236, 0.4)",
              borderWidth: 1,
              barThickness: 15,
            },
          ],
        },
        options:
          chartType === "line" ? LINE_COUNT_CHART_OPTIONS : BAR_CHART_OPTION,
      });

      setCultureCountChartElement(countLineChart);
    }
  }, [cultureGraphData, chartType]);

  function handleCategorySelect(check, name) {
    if (check) {
      setCultureGraphFilter([...cultureGraphFilter, name]);
    } else {
      setCultureGraphFilter(cultureGraphFilter.filter((f) => f !== name));
    }
  }

  function formatValue(val) {
    return val ? parseFloat(Math.round(val)) : Math.round(val || 0);
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

  const graphOptions = [
    {
      label: (
        <div>
          <LineChartOutlined />
          &nbsp;&nbsp; Line Graph
        </div>
      ),
      value: "line",
    },
    {
      label: (
        <div>
          <BarChartOutlined />
          &nbsp;&nbsp; Bar Graph
        </div>
      ),
      value: "bar",
    },
  ];

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
          extra={
            <DatePicker
              format="MMM"
              picker="month"
              style={{ width: 200 }}
              value={cultureGraphMonth}
              disabledDate={disabledFutureDate}
              onChange={(value) => setcultureGraphMonth(value)}
            />
          }
        >
          <Row justify="space-between">
            <Col>
              <Tooltip title="Response rate shows us the frequency of inputted information by team members.">
                <span>All Culture Categories</span> <QuestionCircleOutlined />
              </Tooltip>
            </Col>
            <Col>
              <Space size={15}>
                <Popover
                  placement="bottom"
                  content={
                    <Space direction="vertical" size={10} align="start">
                      <Space>
                        <Button
                          onClick={() =>
                            setCultureGraphFilter([
                              "Average",
                              ...(categories || []).map((c) => c.name),
                            ])
                          }
                          type="primary"
                          size="small"
                        >
                          Select All
                        </Button>
                        <Button
                          onClick={() => setCultureGraphFilter([])}
                          danger
                          type="primary"
                          size="small"
                        >
                          Clear All
                        </Button>
                      </Space>
                      {[{ name: "Average" }, ...categories].map((item) => (
                        <Checkbox
                          checked={cultureGraphFilter.includes(item.name)}
                          onChange={(e) =>
                            handleCategorySelect(e.target.checked, item.name)
                          }
                        >
                          {item.name}
                        </Checkbox>
                      ))}
                    </Space>
                  }
                  trigger="click"
                >
                  <Button>
                    Select Categories <CaretDownOutlined />
                  </Button>
                </Popover>
                <Radio.Group
                  options={graphOptions}
                  onChange={(e) => setChartType(e.target.value)}
                  defaultValue={"bar"}
                  optionType="button"
                  disabled={disableGraphDropdown}
                />
              </Space>
            </Col>
          </Row>
          <br></br>
          <br></br>

          <div>
            <Choose>
              <When condition={allCultureGraphData?.categories}>
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

        <br></br>
        <br></br>
        <br></br>

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

        {/* <br></br>
        <br></br>
        <br></br>

        <Card className="no-header-border">
        <Tooltip title="Overall culture score shows us the avg culture score per week ">
            <Space size={6}>
              <span>Overall Culture Score </span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>
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
        </Card> */}

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
