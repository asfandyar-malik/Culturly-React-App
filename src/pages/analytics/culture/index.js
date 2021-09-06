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
  CaretDownOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
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
  getSurveyQuestionCategories,
  getCultureScorePerCategory,
} from "actions";

import AccountHook from "hooks/account";

const CultureAnalyticsCard = ({ accountData, selectedTeam }) => {
  const allCultureChartRef = useRef(null);
  const cultureCountChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [cultureScore, setCultureScore] = useState({});
  const [cultureItems, setCultureItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cultureGraphFilter, setCultureGraphFilter] = useState([]);
  const [overallcultureScore, setOverallcultureScore] = useState(0);
  const [allCultureGraphData, setAllCultureGraphData] = useState([]);
  const [cultureGraphMonth, setcultureGraphMonth] = useState(moment());
  const [disableGraphDropdown, setDisableGraphDropdown] = useState(false);
  const [allCultureChartElement, setAllCultureChartElement] = useState("");
  const [cultureCountChartElement, setCultureCountChartElement] = useState("");
  const [cultureResponseGraphData, setCultureResponseGraphData] = useState([]);
  const [cultureResponseFilterGraphData, setCultureResponseFilterGraphData] =
    useState([]);

  const isBarChart = chartType === "bar";
  const anonymityThreshold =
    accountData?.workspace?.minimum_anonymity_threshold;

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
  }, [cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    const { startTs, endTs } = getRange();
    getCultureGraph(selectedTeam, startTs, endTs, selectedCategory).then(
      (response) => {
        const { data } = response;
        const responseData = data?.categories?.all?.results || [];
        setAllCultureGraphData(data);
        setCultureResponseGraphData(responseData);
        setCultureResponseFilterGraphData(
          responseData.filter(
            (item) => item.user_response_count >= anonymityThreshold
          )
        );
      }
    );
  }, [selectedCategory, cultureGraphMonth, selectedTeam]);

  useEffect(() => {
    const { categories = {} } = allCultureGraphData;

    if (allCultureChartElement) {
      allCultureChartElement.destroy();
    }

    if (
      cultureResponseFilterGraphData.length &&
      Object.keys(categories).filter((item) => item !== "all").length
    ) {
      let labels = new Set();
      const allDataSets = [];

      Object.keys(categories).forEach((key) => {
        const dataPoints = [];

        if (cultureGraphMonth) {
          const weeks = getWeeksInMonth(
            cultureGraphMonth.format("YYYY"),
            cultureGraphMonth.format("M")
          );

          if (categories[key].results.length) {
            weeks.forEach((week) => {
              const item =
                categories[key].results.find(
                  (i) => moment(i.week).format("D") === week.startDay
                ) || {};
              labels.add(week.format);

              if (item.avg && item.user_response_count >= anonymityThreshold) {
                dataPoints.push(item.avg);
              } else {
                dataPoints.push(0);
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
  }, [
    chartType,
    cultureGraphMonth,
    cultureGraphFilter,
    allCultureGraphData,
    cultureResponseFilterGraphData,
  ]);

  useEffect(() => {
    if (cultureCountChartElement) {
      cultureCountChartElement.destroy();
    }

    if (cultureResponseFilterGraphData.length) {
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
            cultureResponseFilterGraphData.find(
              (i) => moment(i.week).format("D") === week.startDay
            ) || {};
          labels.push(week.format);

          if (item.avg && item.user_response_count >= anonymityThreshold) {
            dataPointsCounts.push(item.response_count || 0);
            dataPointsUniqueUserCounts.push(item.user_response_count || 0);
          } else {
            dataPointsCounts.push(0);
            dataPointsUniqueUserCounts.push(0);
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
  }, [cultureResponseFilterGraphData, chartType]);

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
      <Col span={24} className="mt-12 culture-col">
        <Card
          title={
            <Tooltip title="Your Culture Score is calculated using the weekly culture check">
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
                  <Tooltip title="A comparison to your Culture Score of the previous month">
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
              <p>All Culture Categories</p>
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
                  <Space>
                    <Tooltip title="Filter for culture specific categories or see the total average">
                      <QuestionCircleOutlined />
                    </Tooltip>
                    <Button>
                      Select Categories <CaretDownOutlined />
                    </Button>
                  </Space>
                </Popover>
                <Space>
                  <Radio.Group
                    options={graphOptions}
                    onChange={(e) => setChartType(e.target.value)}
                    defaultValue={"line"}
                    optionType="button"
                    disabled={disableGraphDropdown}
                  />
                  <Tooltip title="Display results in a line chart or bar chart">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              </Space>
            </Col>
          </Row>

          <div>
            <Choose>
              <When
                condition={
                  cultureResponseFilterGraphData.length &&
                  Object.keys(allCultureGraphData?.categories || {}).filter(
                    (item) => item !== "all"
                  ).length
                }
              >
                <canvas ref={allCultureChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Choose>
                    <When condition={cultureResponseGraphData.length}>
                      <Empty description="Not enough data to mantain anonymity in this time period" />
                    </When>
                    <Otherwise>
                      <Empty description="No data available to display for this time period" />
                    </Otherwise>
                  </Choose>
                </div>
              </Otherwise>
            </Choose>
          </div>
        </Card>

        <Card className="no-top-border">
          <Tooltip title="The response rate displays how actively team members share responses">
            <Space>
              <span>Response Rate</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>

          <div className="mt-8">
            <Choose>
              <When condition={cultureResponseFilterGraphData.length}>
                <canvas ref={cultureCountChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Choose>
                    <When condition={cultureResponseGraphData.length}>
                      <Empty description="Not enough data to mantain anonymity in this time period" />
                    </When>
                    <Otherwise>
                      <Empty description="No data available to display for this time period" />
                    </Otherwise>
                  </Choose>
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
              title="The Culture Check displays all 32 scientific questions that are sent to each 
              team member to calculate the culture score. The questions change weekly to guanrantee
               variation and are repeated monthly to guarantee a scientific data analysis"
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

export default AccountHook(CultureAnalyticsCard);
