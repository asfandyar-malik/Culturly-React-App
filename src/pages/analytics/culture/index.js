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
  Select,
  Empty,
  Progress,
  Popover,
  Button,
  Checkbox,
} from "antd";
import {
  CaretDownOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { roundOff } from "_dash";
import {
  BAR_CHART_OPTION,
  CATEGORY_GRAPH_LABEL,
  CATEGORY_GRAPH_COLOR,
  BAR_GRAPH_BORDER_COLORS,
  LINE_COUNT_CHART_OPTIONS,
  BAR_GRAPH_BACKGROUND_COLORS,
} from "../../../constants";
import {
  getWeeksInMonth,
  disabledFutureDate,
  getMonthsBetweenDates,
} from "utils";
import {
  getCultureScore,
  getCultureGraph,
  getAllCultureGraph,
  getSurveyQuestionCategories,
  getCultureScorePerCategory,
} from "actions";

const CultureAnalyticsCard = ({ selectedTeam }) => {
  const allCultureChartRef = useRef(null);
  const cultureCountChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [cultureScore, setCultureScore] = useState({});
  const [cultureItems, setCultureItems] = useState({});
  const [cultureGraphData, setCultureGraphData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cultureGraphFilter, setCultureGraphFilter] = useState([]);
  const [overallcultureScore, setOverallcultureScore] = useState(0);
  const [allCultureGraphData, setAllCultureGraphData] = useState([]);
  const [cultureGraphMonth, setcultureGraphMonth] = useState(moment());
  const [disableGraphDropdown, setDisableGraphDropdown] = useState(false);
  const [allCultureChartElement, setAllCultureChartElement] = useState("");
  const [cultureCountChartElement, setCultureCountChartElement] = useState("");

  const isBarChart = chartType === "bar";

  function getRange() {
    let endTs = moment().endOf("month").utc(true).format("X");
    let startTs = moment()
      .subtract(1, "years")
      .startOf("month")
      .utc(true)
      .format("X");

    if (cultureGraphMonth) {
      endTs = cultureGraphMonth.clone().endOf("month").utc(true).format("X");
      startTs = cultureGraphMonth
        .clone()
        .startOf("month")
        .utc(true)
        .format("X");
    }

    return { startTs, endTs };
  }

  useEffect(() => {
    getSurveyQuestionCategories().then((response) => {
      setCategories([
        {
          custom: true,
          name: "Average",
          slug: "average",
        },
        ...response.data,
      ]);
      setCultureGraphFilter(["Average"]);
    });
  }, []);

  useEffect(() => {
    getCultureScore(selectedTeam).then((response) => {
      setCultureScore(response.data);
    });
  }, [selectedTeam]);

  useEffect(() => {
    let totalScore = 0;
    let totalResponses = 0;
    const { startTs, endTs } = getRange();

    getCultureScorePerCategory(selectedTeam, startTs, endTs).then(
      (response) => {
        setLoading(false);
        const { data } = response;
        Object.keys(data.categories).forEach((key) => {
          (data.categories[key]?.questions || []).forEach((item) => {
            if (item.score) {
              totalResponses += 1;
              totalScore += item.score;
            }
          });
        });
        setCultureItems(data.categories);
        setOverallcultureScore(
          totalResponses ? totalScore / totalResponses : 0
        );
      }
    );

    getAllCultureGraph(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      setAllCultureGraphData(data);
    });
  }, [cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    const { startTs, endTs } = getRange();
    getCultureGraph(selectedTeam, startTs, endTs, selectedCategory).then(
      (response) => {
        setCultureGraphData(response.data);
      }
    );
  }, [selectedCategory, cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    if (allCultureGraphData.categories) {
      let labels = new Set();
      const allDataSets = [];

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

              if (item.avg) {
                // labels.add(week.weekName);
                labels.add(week.format);
                dataPoints.push(item.avg);
              }
            });
          }
        }

        const lineDataset = {
          fill: true,
          data: dataPoints,
          backgroundColor: "#27cdec02",
          label: CATEGORY_GRAPH_LABEL[key],
          borderColor: CATEGORY_GRAPH_COLOR[key],
          pointBackgroundColor: CATEGORY_GRAPH_COLOR[key],
        };

        const chartDataset = {
          fill: true,
          borderWidth: 1,
          data: dataPoints,
          barThickness: 15,
          label: CATEGORY_GRAPH_LABEL[key],
          borderColor: BAR_GRAPH_BORDER_COLORS[key],
          backgroundColor: BAR_GRAPH_BACKGROUND_COLORS[key],
        };

        allDataSets.push(isBarChart ? chartDataset : lineDataset);
      });

      if (labels.size === 1) {
        setChartType("bar");
      }
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
        options: isBarChart ? BAR_CHART_OPTION : LINE_COUNT_CHART_OPTIONS,
      });

      setAllCultureChartElement(allLineChart);
    }
  }, [cultureGraphFilter, cultureGraphMonth, allCultureGraphData, chartType]);

  useEffect(() => {
    if (cultureCountChartElement) {
      cultureCountChartElement.destroy();
    }

    if (cultureGraphData.length) {
      const labels = [];
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
          if (item.avg) {
            // labels.push(week.weekName);
            labels.push(week.format);
            dataPointsCounts.push(item.count || 0);
            dataPointsUniqueUserCounts.push(item.uniqueUsers || 0);
          }
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
          if (item.avg) {
            labels.push(moment(month).format("MMM YYYY"));
            dataPointsCounts.push(item.count || 0);
            dataPointsUniqueUserCounts.push(item.uniqueUsers || 0);
          }
        });
      }

      const countLineChart = new Chart(countChartRef, {
        type: chartType,
        data: {
          labels,
          datasets: [
            {
              fill: true,
              borderWidth: 1,
              barThickness: 15,
              data: dataPointsCounts,
              borderColor: "#7d68eb",
              label: "Number of responses",
              pointBackgroundColor: "#7d68eb",
              backgroundColor: "rgba(125, 104, 235, 0.4)",
            },
            {
              fill: true,
              borderWidth: 1,
              barThickness: 15,
              borderColor: "#30CAEC",
              pointBackgroundColor: "#30CAEC",
              data: dataPointsUniqueUserCounts,
              label: "Number of People answering",
              backgroundColor: "rgba(48, 202, 236, 0.4)",
            },
          ],
        },
        options: isBarChart ? BAR_CHART_OPTION : LINE_COUNT_CHART_OPTIONS,
      });

      setCultureCountChartElement(countLineChart);
    }
  }, [cultureGraphData, chartType]);

  function handleCategoryChange(isChecked, name) {
    if (isChecked) {
      setCultureGraphFilter([...cultureGraphFilter, name]);
    } else {
      setCultureGraphFilter(cultureGraphFilter.filter((f) => f !== name));
    }
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
      <Col span={24} className="mt-12 culture-col">
        <Card
          title={
            <Tooltip
              title="Culture Score is calculated from Weekly Survey checks. Weekly survey checks are sent
              4 times a month and include 9 questions in total in 8 different Culture categories.  "
            >
              <Space>
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
                percent={roundOff(cultureScore.current_month_score)}
              />
            </Col>
            <Col>
              <div className="mb-12">
                <Space>
                  <span>How does score compare?</span>
                  <Tooltip title="You view here your Culture score from previous months">
                    <InfoCircleOutlined className="info-icon" />
                  </Tooltip>
                </Space>
              </div>
              <Space>
                <Card>
                  <p className="text-xl medium">Avg. last month</p>
                  <p className="text-5xl medium">
                    {roundOff(cultureScore.last_month_score)}%
                  </p>
                </Card>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card
          className="no-top-border"
          extra={
            <Space size={16}>
              <Select
                style={{ width: 175 }}
                value={selectedCategory}
                placeholder="Select a category"
                onChange={(value) => setSelectedCategory(value)}
              >
                <Select.Option value="">All</Select.Option>
                {categories
                  .filter((item) => !item.custom)
                  .map((item) => {
                    const { slug } = item;
                    return (
                      <Select.Option value={slug} key={slug}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
              </Select>
              <DatePicker
                format="MMM"
                picker="month"
                allowClear={false}
                style={{ width: 200 }}
                value={cultureGraphMonth}
                disabledDate={disabledFutureDate}
                onChange={(value) => setcultureGraphMonth(value)}
              />
            </Space>
          }
        >
          <Row justify="space-between">
            <Col>
              <Tooltip title="Response rate shows us the frequency of inputted information by team members.">
                <Space>
                  <p>All Culture Categories</p>
                  <QuestionCircleOutlined />
                </Space>
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
                            setCultureGraphFilter(categories.map((c) => c.name))
                          }
                          size="small"
                          type="primary"
                        >
                          Select All
                        </Button>
                        <Button
                          danger
                          size="small"
                          type="primary"
                          onClick={() => setCultureGraphFilter([])}
                        >
                          Clear All
                        </Button>
                      </Space>
                      {categories.map((item) => (
                        <Checkbox
                          key={item}
                          checked={cultureGraphFilter.includes(item.name)}
                          onChange={(e) =>
                            handleCategoryChange(e.target.checked, item.name)
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
                <Select
                  value={chartType}
                  disabled={disableGraphDropdown}
                  suffixIcon={<CaretDownOutlined />}
                  onChange={(type) => setChartType(type)}
                >
                  <Select.Option value="line">Line Graph</Select.Option>
                  <Select.Option value="bar">Bar Graph</Select.Option>
                </Select>
              </Space>
            </Col>
          </Row>

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

        <Card className="no-top-border">
          <Tooltip title="Response rate shows us the frequency of inputted information by team members. ">
            <Space>
              <span>Response Rate</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>

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

        <Card
          className="no-top-border"
          loading={loading}
          title={
            <Tooltip
              title="Culturly score is calcuated from the response to Culture Check, which is a 
              weekly survey used to measure Engagement, Mood, Wellbeing, Collaboration, Impact."
            >
              <Space>
                <span>Culture score</span>
                <QuestionCircleOutlined />
              </Space>
            </Tooltip>
          }
        >
          <Row justify="space-between" className="text-2xl mb-12">
            <Col className="font-medium">Overall culture score</Col>
            <Col className="font-medium">
              <Badge
                color={getBadgeColor(overallcultureScore)}
                text={`${roundOff(overallcultureScore)}%`}
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
                      text={`${roundOff(meanScore)}%`}
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
                          <Choose>
                            <When condition={score}>
                              <Badge
                                color={getBadgeColor(score)}
                                text={`${roundOff(score)}%`}
                              />
                            </When>
                            <Otherwise>
                              <p>NA</p>
                            </Otherwise>
                          </Choose>
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
  );
};

export default CultureAnalyticsCard;
