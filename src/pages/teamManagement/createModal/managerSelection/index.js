import { useEffect, useState } from "react";
import { Col, Row, Space, Button, Tooltip, message, Input, Avatar } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const TeamManagerSelectionStep = ({
  saving,
  managers,
  teamDetail,
  onBack,
  onProceed,
}) => {
  const [allManagers, setAllManagers] = useState([]);
  const [filterManagers, setFilterManagers] = useState([]);
  const [isInitalLoaded, setIsInitalLoaded] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState([]);

  useEffect(() => {
    setAllManagers(managers);
    setFilterManagers(managers);
    setSelectedManagers(teamDetail.managers.map((item) => item.member));
    setIsInitalLoaded(true);
  }, [managers, teamDetail]);

  useEffect(() => {
    if (isInitalLoaded) {
      let newManagers = [...allManagers];
      newManagers = newManagers.filter(
        (item) => !selectedManagers.map((i) => i.id).includes(item.id)
      );
      setFilterManagers([...newManagers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedManagers]);

  function onSearch(value) {
    let newManagers = [...allManagers];
    newManagers = newManagers.filter(
      (item) => !selectedManagers.map((i) => i.id).includes(item.id)
    );
    if (value) {
      const searchManagers = newManagers.filter(
        (item) =>
          item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.display_name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
      setFilterManagers([...searchManagers]);
    } else {
      setFilterManagers([...newManagers]);
    }
  }

  const onDeselectManager = (member) => {
    const index = selectedManagers.findIndex((item) => item.id === member.id);
    if (index > -1) {
      const memberIndex = allManagers.findIndex(
        (item) => item.id === member.id
      );
      if (memberIndex === -1) {
        allManagers.push(member);
        setAllManagers(allManagers);
      }
      selectedManagers.splice(index, 1);
      setSelectedManagers([...selectedManagers]);
    }
  };

  function getExistingManagerId(memberId) {
    const teamMembers = teamDetail.managers;
    const member = teamMembers.find((item) => item.member.id === memberId);
    return member ? member.id : null;
  }

  function onSubmit() {
    if (selectedManagers.length) {
      const managerArrary = selectedManagers.map((item) => {
        return {
          id: getExistingManagerId(item.id),
          member: {
            id: item.id,
          },
        };
      });
      const payload = {
        managers: managerArrary,
      };
      onProceed(payload);
    } else {
      message.error("Please select manangers");
    }
  }

  return (
    <Row gutter={32}>
      <Col span={8}>
        <Tooltip
          title="Managers have access to viewing Analytics, managing Team members, 
          editing Team, managing Member access etc "
        >
          <Space size={6}>
            <p className="text-2xl">Select managers</p>
            <QuestionCircleOutlined />
          </Space>
        </Tooltip>
        <Input.Search
          size="large"
          className="mt-16 mb-16"
          style={{ width: "100%" }}
          placeholder="Enter to search managers"
          onSearch={(value) => onSearch(value)}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Choose>
          <When condition={filterManagers.length}>
            <div className="members-list">
              {filterManagers.map((item) => {
                const name = item.display_name || item.name;
                return (
                  <Space className="member-list-item" key={item.id}>
                    <Space>
                      <Avatar size={44} src={item.avatar} />
                      <p className="text-xl secondary medium">{name}</p>
                    </Space>
                    <PlusCircleOutlined
                      onClick={() =>
                        setSelectedManagers([...selectedManagers, item])
                      }
                    />
                  </Space>
                );
              })}
            </div>
          </When>
          <Otherwise>
            <p className="text-2xl secondary">No members</p>
          </Otherwise>
        </Choose>
      </Col>
      <Col span={16}>
        <p className="text-2xl">Selected managers</p>
        <Choose>
          <When condition={selectedManagers.length}>
            <div className="selected-item-list">
              {selectedManagers.map((item) => {
                const name = item.display_name || item.name;
                return (
                  <Space className="member-list-item" key={item.id}>
                    <Space>
                      <Avatar size={44} src={item.avatar} />
                      <p className="text-xl secondary medium">{name}</p>
                    </Space>
                    <DeleteOutlined onClick={() => onDeselectManager(item)} />
                  </Space>
                );
              })}
            </div>
          </When>
          <Otherwise>
            <p className="text-2xl secondary">No managers selected</p>
          </Otherwise>
        </Choose>
        <Space size={20} className="mt-24">
          <Button
            size="large"
            type="primary"
            loading={saving}
            onClick={() => onSubmit()}
            disabled={!selectedManagers.length}
          >
            Continue
          </Button>
          <Button size="large" disabled={saving} onClick={() => onBack()}>
            Back
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default TeamManagerSelectionStep;
