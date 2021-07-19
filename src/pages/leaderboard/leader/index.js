import { useEffect, useState } from "react";
import {
  Avatar,
  Col,
  List,
  Row,
  Space
} from "antd";

import upArrow from "assets/images/up.png";
import downArrow from "assets/images/down.png";
import { getLeaderboardScore } from "actions";

const Leader = ({ selectedTeam, leaderboardMonth }) => {

  const [loading, setLoading] = useState(true);
  const [leaderboardScores, setLeaderboardScore] = useState([]);

  useEffect(() => {  
    
    if (leaderboardMonth) {
      const endTs = leaderboardMonth.endOf("month").utc(true).format("X");
      const startTs = leaderboardMonth.startOf("month").utc(true).format("X");

      getLeaderboardScore(selectedTeam, endTs, startTs).then((response) => {
        setLoading(false);
        setLeaderboardScore(response.data.output);
      });
    }

  }, [selectedTeam, leaderboardMonth]);

  function renderOutput(item, index) {
    return (
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
          <Col span={3}>{item.leaderboard_score} </Col>
          <Col span={4}>
            <div className="updown-logo">
              {index < 3 ? <img src={upArrow} alt="up arrow" /> : <img src={downArrow} alt="down arrow" />}
            </div>                
          </Col>
        </Row>
      </List.Item>
    )
  }

  return (
    <div>
    <br></br>
    <List
      loading={loading}
      dataSource={leaderboardScores}
      className="leaderboard leaderboard-list "
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
        renderOutput(item,index)
      )}
    />
    </div>
  );
};

export default Leader;