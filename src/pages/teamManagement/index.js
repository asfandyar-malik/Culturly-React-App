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
  Space,
} from "antd";
import { useLocation } from "react-router";
import { EllipsisOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { isEmpty } from "_dash";
import {
  getWorkspaceTeams,
  deleteWorkspaceTeam,
  getSurveys,
  getWorkspaceRemainingTeamMembers,
  getWorkspaceRemainingTeamManagers,
} from "actions";

import AccountHook from "hooks/account";
import CreateTeamModal from "./createModal";
import CreateAdminModal from "components/createAdminModal";

import "./style.scss";

const TeamManagement = ({ accountData }) => {
  const location = useLocation();
  const { member = {} } = accountData;
  const isLoggedIn = !isEmpty(accountData);

  let [teams, setTeams] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [canCreateTeam, setCreateTeam] = useState(false);
  const [members, setMembers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [addAdminModalVisible, setAddAdminModalVisible] = useState(false);

  const isNewInstalled = location.state?.is_new_installed || false;
  const hasWriteAccess = member?.is_admin || member?.is_manager;

  useEffect(() => {
    if (createModalVisible) {
    }
  }, [createModalVisible]);

  useEffect(() => {
    if (isNewInstalled) {
      if (member?.is_admin) {
        setAddAdminModalVisible(true);
      } else {
        if (member?.is_manager) {
          setCreateModalVisible(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewInstalled]);

  useEffect(() => {
    if (isLoggedIn) {
      getWorkspaceTeams().then((response) => {
        const { data } = response;
        setLoading(false);
        setTeams(data.results);
        setCreateTeam(data.can_create_team);
      });
      getSurveys().then((response) => {
        setSurveys(response.data.results);
      });
    }
  }, [isLoggedIn]);

  function handleCreateTeam() {
    message.loading({
      content: "Loading members and managers...",
      duration: 0,
      key: "loader",
    });
    getWorkspaceRemainingTeamMembers().then((response) => {
      if (response.data && response.data.length > 0) {
        message.success({
          content: "Members and managers loaded",
          duration: 3,
          key: "loader",
        });
        setMembers(response.data);
        setCreateModalVisible(true);
      } else {
        message.error({
          content: "No team member available",
          duration: 3,
          key: "loader",
        });
      }
    });
    getWorkspaceRemainingTeamManagers().then((response) => {
      setManagers(response.data);
    });
  }

  function onAdminAddModalClose() {
    setAddAdminModalVisible(false);
    setCreateModalVisible(true);
  }

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
      <div className="max-container">
        <If condition={hasWriteAccess}>
          <Row justify="end">
            <Col>
              <Tooltip title="Only managers and admins can create team">
                <Button
                  type="primary"
                  disabled={!canCreateTeam}
                  onClick={handleCreateTeam}
                >
                  Create team
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </If>
        <List
          loading={loading}
          dataSource={teams}
          className="common-list team-management"
          header={
            <Row gutter={32}>
              <Col span={6}>Team name</Col>
              <Col span={6}>
                <Tooltip
                  title="Members receive Mood Check Survey and Culture check Survey on Slack. 
              One member can be part of only one Team"
                >
                  <Space size={6}>
                    <span>Members</span>
                    <QuestionCircleOutlined />
                  </Space>
                </Tooltip>
              </Col>
              <Col span={6}>
                <Tooltip
                  title="Managers have access to create Teams, Edit Surveys, Edit user access, 
              View Analytics etc"
                >
                  <Space size={6}>
                    <span>Managers</span>
                    <QuestionCircleOutlined />
                  </Space>
                </Tooltip>
              </Col>
            </Row>
          }
          renderItem={(item) => (
            <List.Item>
              <Row gutter={32} className="font-medium">
                <Col span={6}>{item.name}</Col>
                <Col span={6}>
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
                <Col span={6}>
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
                <Choose>
                  <When condition={hasWriteAccess}>
                    <Col span={6}>
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
                  </When>
                  <Otherwise>
                    <Col span={6} />
                  </Otherwise>
                </Choose>
              </Row>
            </List.Item>
          )}
        />
      </div>
      <CreateTeamModal
        surveys={surveys}
        members={members}
        managers={managers}
        selectedTeam={selectedTeam}
        visible={createModalVisible}
        onUpdateTeam={(data) => onTeamCreate(data)}
        onClose={() => setCreateModalVisible(false)}
      />
      <CreateAdminModal
        visible={addAdminModalVisible}
        onClose={() => onAdminAddModalClose()}
      />
    </>
  );
};

export default AccountHook(TeamManagement);
