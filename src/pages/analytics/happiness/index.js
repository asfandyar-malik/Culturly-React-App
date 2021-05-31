import moment from "moment";
import Chart from "chart.js/auto";
import { useEffect, useState, useRef } from "react";
import { Card, Col, Row, Progress, Space, DatePicker, Tooltip } from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { LINE_CHART_OPTIONS } from "../../../constants";
import { getWeekDaysOfWeek, getWeekDaysOfMonth } from "utils";
import { getHappinessScore, getHappinessGraph } from "actions";

const HappinessAnalyticsCard = ({ selectedTeam }) => {
  const happinessChartRef = useRef(null);
  const [happinessScore, setHappinessScore] = useState({});
  const [happinessGraphWeek, setHappinessGraphWeek] = useState();
  const [happinessGraphMonth, setHappinessGraphMonth] = useState(moment());
  const [happinessChartElement, setHappinessChartElement] = useState("");

  const [happinessGraphData, setHappinessGraphData] = useState([]);

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
    if (happinessGraphMonth) {
      const endTs = happinessGraphMonth.endOf("month").format("X");
      const startTs = happinessGraphMonth.startOf("month").format("X");
      setHappinessGraphWeek();
      getHappinessGraphData(startTs, endTs);
    }
  }, [selectedTeam, happinessGraphMonth]);

  useEffect(() => {
    if (happinessGraphWeek) {
      const endTs = happinessGraphWeek.endOf("week").format("X");
      const startTs = happinessGraphWeek.startOf("week").format("X");
      setHappinessGraphMonth();
      getHappinessGraphData(startTs, endTs);
    }
  }, [selectedTeam, happinessGraphWeek]);

  useEffect(() => {
    if (happinessChartElement) {
      happinessChartElement.destroy();
    }
    if (happinessGraphData.length) {
      let weekDays = [];
      const labels = [];
      let labelKey = "";
      const dataPoints = [];
      const chartRef = happinessChartRef.current.getContext("2d");

      if (happinessGraphMonth) {
        weekDays = getWeekDaysOfMonth(
          happinessGraphMonth.format("YYYY"),
          happinessGraphMonth.format("M")
        );
        labelKey = "weekDay";
      }

      if (happinessGraphWeek) {
        weekDays = getWeekDaysOfWeek(
          happinessGraphWeek.format("YYYY"),
          happinessGraphWeek.format("M"),
          happinessGraphWeek.format("D")
        );
        labelKey = "dayName";
      }

      weekDays.forEach((dayItem) => {
        const item =
          happinessGraphData.find(
            (i) => moment(i.day).format("D") === dayItem.day
          ) || {};
        labels.push(dayItem[labelKey]);
        dataPoints.push(item.avg || 0);
      });

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
      setHappinessChartElement(lineChart);
    }
  }, [happinessGraphData]);

  function formatValue(val) {
    return val ? parseFloat(val.toFixed(2)) : val;
  }

  return (
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
        <Card
          extra={
            <Space size={16}>
              <DatePicker
                format="MMM"
                picker="month"
                allowClear={false}
                style={{ width: 200 }}
                value={happinessGraphMonth}
                onChange={(value) => setHappinessGraphMonth(value)}
              />
              <DatePicker
                picker="week"
                format="DD-MMM"
                allowClear={false}
                style={{ width: 200 }}
                value={happinessGraphWeek}
                onChange={(value) => setHappinessGraphWeek(value)}
              />
            </Space>
          }
        >
          <canvas ref={happinessChartRef} height={320} />
        </Card>
      </Col>
    </Row>
  );
};

export default HappinessAnalyticsCard;
