  import { useEffect, useState } from "react";
  import {
    Avatar,
    Col,
    List,
    Row,
    Space,
  } from "antd";

  import { getLeaderboardScore } from "actions";

  import "./style.scss";

  const Leaderboard = () => {
    const [loading, setLoading] = useState(true);
    const [leaderboardScores, setLeaderboardScore] = useState([]);
    const [exactScore, setExactScore] = useState([]);


    useEffect(() => {
      getLeaderboardScore().then((response) => {
        setLoading(false);
        setLeaderboardScore(response.data.member);
        setExactScore(response.data.leaderboard_score);
      });
    }, []);

    return (
      <List
        loading={loading}
        dataSource={leaderboardScores}
        className="common-list leaderboard max-container"
        header={
          <Row gutter={32}>
            <Col span={6}>Leader</Col>
            <Col span={4}>Team</Col>
            <Col span={4}>Score</Col>
          </Row>
        }
        renderItem={(item) => (
          <List.Item>
            <Row gutter={32} className="font-medium">
              <Col span={6}>
                <Space>
                  <Avatar src={item.avatar} />
                  {item.display_name || item.name}
                </Space>
              </Col>
              <Col span={4}>{item.team || "-"}</Col>
              <Col span={4}>{exactScore} </Col>
            </Row>
          </List.Item>
        )}

      />
    );
  };

  export default Leaderboard;