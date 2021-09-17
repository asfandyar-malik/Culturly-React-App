import moment from "moment";
import Chart from "chart.js/auto";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  Col,
  Row,
  Progress,
  Space,
  DatePicker,
  Tooltip,
  Empty,
  Form,
} from "antd";
import {
  EyeOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  LINE_CHART_OPTIONS,
  LINE_COUNT_CHART_OPTIONS,
} from "../../../constants";
import { roundOff } from "_dash";
import { getWeekDays, disabledFutureDate } from "utils";
import { getHappinessScore, getHappinessGraph } from "actions";

import AccountHook from "hooks/account";

const HappinessAnalyticsCard = ({ accountData, selectedTeam }) => {
  const happinessChartRef = useRef(null);
  const happinessCountChartRef = useRef(null);

  const [happinessScore, setHappinessScore] = useState({});
  const [happinessGraphWeek, setHappinessGraphWeek] = useState();
  const [happinessGraphData, setHappinessGraphData] = useState([]);
  const [happinessGraphMonth, setHappinessGraphMonth] = useState(moment());
  const [happinessFilterGraphData, setHappinessFilterGraphData] = useState([]);

  const [happinessChartElement, setHappinessChartElement] = useState("");
  const [happinessCountChartElement, setHappinessCountChartElement] =
    useState("");

  const anonymityThreshold =
    accountData?.workspace?.minimum_anonymity_threshold;

  useEffect(() => {
    getHappinessScore(selectedTeam).then((response) => {
      setHappinessScore(response.data);
    });
  }, [selectedTeam]);

  function getHappinessGraphData(startTs, endTs) {
    getHappinessGraph(selectedTeam, startTs, endTs).then((response) => {
      const { data } = response;
      setHappinessGraphData(data);
      setHappinessFilterGraphData(
        data.filter((item) => item.count >= anonymityThreshold)
      );
    });
  }

  useEffect(() => {
    if (happinessGraphWeek || happinessGraphMonth) {
      let endTs = "";
      let startTs = "";
      if (happinessGraphWeek) {
        endTs = happinessGraphWeek.endOf("week").format("X");
        startTs = happinessGraphWeek.startOf("week").format("X");
      }
      if (happinessGraphMonth) {
        endTs = happinessGraphMonth.endOf("month").format("X");
        startTs = happinessGraphMonth.startOf("month").format("X");
      }
      getHappinessGraphData(startTs, endTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam, happinessGraphMonth, happinessGraphWeek]);

  useEffect(() => {
    if (happinessChartElement) {
      happinessChartElement.destroy();
    }
    if (happinessCountChartElement) {
      happinessCountChartElement.destroy();
    }
    if (happinessFilterGraphData.length) {
      let weekDays = [];
      let labelKey = "";

      const labels = [];
      const dataPoints = [];
      const dataPointsCounts = [];

      const chartRef = happinessChartRef.current.getContext("2d");
      const countChartRef = happinessCountChartRef.current.getContext("2d");

      if (happinessGraphMonth) {
        labelKey = "weekDay";
        weekDays = getWeekDays(
          happinessGraphMonth.clone().startOf("month"),
          happinessGraphMonth.clone().endOf("month")
        );
      }

      if (happinessGraphWeek) {
        labelKey = "dayName";
        weekDays = getWeekDays(
          happinessGraphWeek.clone().startOf("week"),
          happinessGraphWeek.clone().endOf("week")
        );
      }

      weekDays.forEach((dayItem) => {
        const item =
          happinessFilterGraphData.find(
            (i) => moment(i.day).format("DD-MMM") === dayItem.weekDay
          ) || {};
        labels.push(dayItem[labelKey]);
        dataPoints.push(item.avg);
        dataPointsCounts.push(item.count);
      });

      const lineChart = new Chart(chartRef, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              fill: true,
              data: dataPoints,
              borderColor: "#7D68EB",
              label: "Happiness Score",
              backgroundColor: "#7D68EB30",
              pointBackgroundColor: "#7D68EB",
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
              data: dataPointsCounts,
              borderColor: "#7D68EB",
              label: "Number of Responses",
              backgroundColor: "#7D68EB30",
              pointBackgroundColor: "#7D68EB",
            },
          ],
        },
        options: LINE_COUNT_CHART_OPTIONS,
      });

      setHappinessChartElement(lineChart);
      setHappinessCountChartElement(countLineChart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [happinessFilterGraphData]);

  return (
    <Row>
      <Col span={24} className="mt-12 happiness-col">
        <Card
          className="header-card"
          title={
            <Tooltip title="Your Happiness score is calculated using the daily happiness check">
              <Space size={6} className="text-xl medium">
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
                strokeWidth={10}
                strokeColor="#7D68EB"
                format={(percent) => `${percent}%`}
                percent={roundOff(happinessScore.current_week_score)}
              />
            </Col>
            <Col>
              <div className="mb-12 text-right text-xl medium">
                <Space>
                  <span>How does score compare?</span>
                  <Tooltip title="A comparison to your Happiness Score of the previous month and previous week">
                    <InfoCircleOutlined className="info-icon" />
                  </Tooltip>
                </Space>
              </div>
              <Space size={16}>
                <Card className="analytic-card">
                  <p className="text-xl medium">Last week</p>
                  <p className="text-5xl medium">
                    {roundOff(happinessScore.last_week_score)}%
                  </p>
                </Card>
                <Card className="analytic-card">
                  <p className="text-xl medium">Avg. last month</p>
                  <p className="text-5xl medium">
                    {roundOff(happinessScore.last_month_score)}%
                  </p>
                </Card>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card
          className="no-top-border"
          extra={
            <Form>
              <Space size={16}>
                <Form.Item className="no-margin">
                  <DatePicker
                    size="large"
                    format="MMM"
                    picker="month"
                    allowClear={false}
                    style={{ width: 200 }}
                    value={happinessGraphMonth}
                    disabledDate={disabledFutureDate}
                    onChange={(value) => {
                      setHappinessGraphWeek();
                      setHappinessGraphMonth(value);
                    }}
                  />
                </Form.Item>
                <Form.Item className="no-margin">
                  <DatePicker
                    size="large"
                    picker="week"
                    format="DD-MMM"
                    allowClear={false}
                    style={{ width: 200 }}
                    value={happinessGraphWeek}
                    disabledDate={disabledFutureDate}
                    onChange={(value) => {
                      setHappinessGraphMonth();
                      setHappinessGraphWeek(value);
                    }}
                  />
                </Form.Item>
              </Space>
            </Form>
          }
        >
          <div>
            <Choose>
              <When condition={happinessFilterGraphData.length}>
                <canvas ref={happinessChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Choose>
                    <When condition={happinessGraphData.length}>
                      <Empty description="Not enough data to mantain anonymity in this time period" />
                    </When>
                    <Otherwise>
                      <Empty description="No happinesss score available to display in this time period" />
                    </Otherwise>
                  </Choose>
                </div>
              </Otherwise>
            </Choose>
          </div>
          <Space
            size={4}
            className="text-xl secondary w-full justify-center mt-20"
          >
            <EyeOutlined />
            <p>
              Data is only shown if sample size is large enough to gurantee
              anonymity
            </p>
          </Space>
        </Card>
        <Card
          className="no-top-border"
          title={
            <Tooltip title="The Response Rate displays how actively team members share responses">
              <Space size={6} className="text-xl medium">
                <span>Response Rate</span>
                <QuestionCircleOutlined />
              </Space>
            </Tooltip>
          }
        >
          <div>
            <Choose>
              <When condition={happinessFilterGraphData.length}>
                <canvas ref={happinessCountChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Choose>
                    <When condition={happinessGraphData.length}>
                      <Empty description="Not enough data to mantain anonymity" />
                    </When>
                    <Otherwise>
                      <Empty description="No happiness rate available to display" />
                    </Otherwise>
                  </Choose>
                </div>
              </Otherwise>
            </Choose>
          </div>
          <Space
            size={4}
            className="text-xl secondary w-full justify-center mt-20"
          >
            <EyeOutlined />
            <p>
              Data is only shown if sample size is large enough to gurantee
              anonymity
            </p>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default AccountHook(HappinessAnalyticsCard);
