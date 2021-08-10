import moment from "moment";
import { useEffect, useState } from "react";
import { Select, DatePicker, Space, List, Row, Col, Avatar } from "antd";

import { disabledFutureDate } from "utils";
import { getWorkspaceTeams, getLeaderboardScore } from "actions";

import AccountHook from "hooks/account";
import upArrow from "assets/images/up.png";
import downArrow from "assets/images/down.png";

import "./style.scss";

const Leaderboard = ({ accountData }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [leaderboardScores, setLeaderboardScores] = useState([]);
  const [leaderboardMonth, setLeaderboardMonth] = useState(moment());

  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
    });
  }, []);

  useEffect(() => {
    if (leaderboardMonth) {
      setLoading(true);
      const endTs = leaderboardMonth.endOf("month").utc(true).format("X");
      const startTs = leaderboardMonth.startOf("month").utc(true).format("X");

      getLeaderboardScore(selectedTeam, endTs, startTs).then((response) => {
        setLoading(false);
        setLeaderboardScores(response.data);
      });
    }
  }, [selectedTeam, leaderboardMonth]);

  return (
    <div className="leaderboard-page max-container">
      <Space>
        <Select
          value={selectedTeam}
          style={{ width: 300 }}
          placeholder="Select a team"
          onChange={(value) => setSelectedTeam(value)}
        >
          <Select.Option value="">All Department</Select.Option>
          {teams.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
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
          value={leaderboardMonth}
          disabledDate={disabledFutureDate}
          onChange={(value) => setLeaderboardMonth(value)}
        />
      </Space>
      <List
        loading={loading}
        dataSource={leaderboardScores}
        header={
          <Row gutter={32}>
            <Col span={2}>#</Col>
            <Col span={8}>Leader</Col>
            <Col span={5}>Team</Col>
            <Col span={5}>Score</Col>
            <Col span={4}>Change</Col>
          </Row>
        }
        renderItem={(item, index) => (
          <List.Item>
            <Row gutter={32} className="font-medium">
              <Col span={2}>{index + 1}</Col>
              <Col span={8}>
                <Space>
                  <Avatar src={item.avatar} />
                  {item.display_name || item.name}
                </Space>
              </Col>
              <Col span={5}>{item.team || "-"}</Col>
              <Col span={5}>{item.leaderboard_score} </Col>
              <Col span={4} className="progress-col">
                <Choose>
                  <When condition={index < 3}>
                    <img src={upArrow} alt="up arrow" />
                  </When>
                  <Otherwise>
                    <img src={downArrow} alt="down arrow" />
                  </Otherwise>
                </Choose>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AccountHook(Leaderboard);
