import { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Divider,
  Popconfirm,
  Avatar,
  Tooltip,
} from "antd";

import { getWorkspaceTeams, getSurveys, deleteWorkspaceTeam } from "../actions";

import CreateTeamModal from "./createModal";

import "./style.scss";

const TeamManagement = () => {
  let [teams, setTeams] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamsCount, setTeamsCount] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    if (!createModalVisible) {
      setSelectedTeam({});
    }
  }, [createModalVisible]);

  function onDeleteConfirm(team) {
    deleteWorkspaceTeam(team.id).then((response) => {
      const index = teams.findIndex((item) => item.id === team.id);
      if (index > -1) {
        teams.splice(index, 1);
        setTeams([...teams]);
      }
    });
  }

  function onEditTeam(team) {
    setSelectedTeam(team);
    setCreateModalVisible(true);
  }

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "members",
      title: "Members",
      render: (record) => (
        <Avatar.Group maxCount={5}>
          {record.members.map((item) => {
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
      ),
    },
    {
      key: "managers",
      title: "Managers",
      render: (record) => (
        <Avatar.Group maxCount={5}>
          {record.managers.map((item) => {
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
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return (
          <Space>
            <a onClick={() => onEditTeam(record)}>Edit</a>
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure want to delete this team?"
              onConfirm={() => onDeleteConfirm(record)}
            >
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getWorkspaceTeams().then((response) => {
      const { data } = response;
      setTeams(data.results);
      setTeamsCount(data.count);
      setLoading(false);
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

  return (
    <>
      <Card
        title="Teams"
        className="team-management-card"
        extra={
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            Create team
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={teams}
          pagination={{ total: teamsCount }}
        />
      </Card>
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
