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
} from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import {
  LINE_CHART_OPTIONS,
  LINE_COUNT_CHART_OPTIONS,
} from "../../../constants";
import { roundOff } from "_dash";
import { getWeekDays, disabledFutureDate } from "utils";
import { getHappinessScore, getHappinessGraph } from "actions";

const HappinessAnalyticsCard = ({ selectedTeam }) => {
  const happinessChartRef = useRef(null);
  const happinessCountChartRef = useRef(null);

  const [happinessScore, setHappinessScore] = useState({});
  const [happinessGraphWeek, setHappinessGraphWeek] = useState();
  const [happinessGraphData, setHappinessGraphData] = useState([]);
  const [happinessGraphMonth, setHappinessGraphMonth] = useState(moment());

  const [happinessChartElement, setHappinessChartElement] = useState("");
  const [happinessCountChartElement, setHappinessCountChartElement] =
    useState("");

  useEffect(() => {
    getHappinessScore(selectedTeam).then((response) => {
      setHappinessScore(response.data);
    });
  }, [selectedTeam]);

  function getHappinessGraphData(startTs, endTs) {
    getHappinessGraph(selectedTeam, startTs, endTs).then((response) => {
      setHappinessGraphData(response.data);
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
    if (happinessGraphData.length) {
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
          happinessGraphData.find(
            (i) => moment(i.day).format("DD-MMM") === dayItem.weekDay
          ) || {};
        labels.push(dayItem[labelKey]);
        dataPoints.push(item.avg || 0);
        dataPointsCounts.push(item.count || 0);
      });

      const lineChart = new Chart(chartRef, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              fill: true,
              data: dataPoints,
              borderColor: "#30CAEC",
              label: "Happiness Score",
              backgroundColor: "#30CAEC30",
              pointBackgroundColor: "#30CAEC",
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
              borderColor: "#ffde62",
              label: "Number of Responses",
              backgroundColor: "#ffde6267",
              pointBackgroundColor: "#ffde62",
            },
          ],
        },
        options: LINE_COUNT_CHART_OPTIONS,
      });

      setHappinessChartElement(lineChart);
      setHappinessCountChartElement(countLineChart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [happinessGraphData]);

  return (
    <Row>
      <Col span={24} className="mt-12 happiness-col">
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
                percent={roundOff(happinessScore.current_week_score)}
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
                    {roundOff(happinessScore.last_week_score)}%
                  </p>
                </Card>
                <Card>
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
            <Space size={16}>
              <DatePicker
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
              <DatePicker
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
            </Space>
          }
        >
          <div>
            <Choose>
              <When condition={happinessGraphData.length}>
                <canvas ref={happinessChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Empty description="No happinesss score available to display" />
                </div>
              </Otherwise>
            </Choose>
          </div>
          <Tooltip title="Response rate shows us the frequency of inputted information by team members. ">
            <Space size={6} className="mt-16">
              <span>Response Rate</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>
          <div>
            <Choose>
              <When condition={happinessGraphData.length}>
                <canvas ref={happinessCountChartRef} height={320} />
              </When>
              <Otherwise>
                <div className="empty-container vertical-center">
                  <Empty description="No happiness rate available to display" />
                </div>
              </Otherwise>
            </Choose>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default HappinessAnalyticsCard;
