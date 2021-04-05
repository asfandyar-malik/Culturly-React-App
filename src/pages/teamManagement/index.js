import { useEffect, useState } from "react";
import {
  Avatar,
  Col,
  List,
  Row,
  Tooltip,
  Menu,
  Dropdown,
  message,
  Button,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

import { getWorkspaceTeams, deleteWorkspaceTeam, getSurveys } from "actions";

import CreateTeamModal from "./createModal";

import "./style.scss";

const TeamManagement = () => {
  let [teams, setTeams] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    if (!createModalVisible) {
      setSelectedTeam({});
    }
  }, [createModalVisible]);

  useEffect(() => {
    getWorkspaceTeams().then((response) => {
      setLoading(false);
      setTeams(response.data.results);
    });
    getSurveys().then((response) => {
      setSurveys(response.data.results);
    });
  }, []);

  function onTeamCreate(newTeam) {
    const index = teams.findIndex((item) => item.id === newTeam.id);
    if (index > -1) {
      teams[index] = newTeam;
    } else {
      teams = [newTeam, ...teams];
    }
    setTeams([...teams]);
  }

  function onDeleteTeam(team) {
    deleteWorkspaceTeam(team.id).then((response) => {
      const index = teams.findIndex((item) => item.id === team.id);
      if (index > -1) {
        teams.splice(index, 1);
        setTeams([...teams]);
        message.success("Team deleted");
      }
    });
  }

  function onEditTeam(team) {
    setSelectedTeam(team);
    setCreateModalVisible(true);
  }

  return (
    <>
      <Row justify="end">
        <Col>
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            Create team
          </Button>
        </Col>
      </Row>
      <List
        loading={loading}
        dataSource={teams}
        className="common-list team-management"
        header={
          <Row gutter={32}>
            <Col span={6}>Team name</Col>
            <Col span={4}>Members</Col>
            <Col span={4}>Managers</Col>
          </Row>
        }
        renderItem={(item) => (
          <List.Item>
            <Row gutter={32} className="font-medium">
              <Col span={6}>{item.name}</Col>
              <Col span={4}>
                <Avatar.Group maxCount={5}>
                  {item.members.map((item) => {
                    const { member } = item;
                    return (
                      <Tooltip
                        key={member.id}
                        title={member.display_name || member.name}
                      >
                        <Avatar src={member.avatar} />
                      </Tooltip>
                    );
                  })}
                </Avatar.Group>
              </Col>
              <Col span={4}>
                <Avatar.Group maxCount={5}>
                  {item.managers.map((item) => {
                    const { member } = item;
                    return (
                      <Tooltip
                        key={member.id}
                        title={member.display_name || member.name}
                      >
                        <Avatar src={member.avatar} />
                      </Tooltip>
                    );
                  })}
                </Avatar.Group>
              </Col>
              <Col span={10}>
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => onEditTeam(item)}>
                        Edit
                      </Menu.Item>
                      <Menu.Item onClick={() => onDeleteTeam(item)}>
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <EllipsisOutlined rotate={90} />
                </Dropdown>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <CreateTeamModal
        surveys={surveys}
        selectedTeam={selectedTeam}
        visible={createModalVisible}
        onUpdateTeam={(data) => onTeamCreate(data)}
        onClose={() => setCreateModalVisible(false)}
      />
    </>
  );
};

export default TeamManagement;
