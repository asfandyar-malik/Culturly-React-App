  import { useEffect, useState } from "react";
  import {
    Avatar,
    Col,
    List,
    Row,
    Space, 
    Tag,

  } from "antd";

  import upArrow from "assets/images/up.png";
  import downArrow from "assets/images/down.png";


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
              <Col span={3}>{exactScore} </Col>
              <Col span={4}>
                <div className="updown-logo">
                  {index < 3 ? <img src={upArrow} alt="up arrow" /> : <img src={downArrow} alt="down arrow" />}
                </div>                
              </Col>
            </Row>
          </List.Item>
        )}
      />
    );
  };

  export default Leaderboard;