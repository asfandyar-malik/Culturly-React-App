import { useEffect, useState } from "react";
import { Col, Row, Space, Button, Tooltip, message } from "antd";
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
  }, [selectedManagers]);

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
    <Row gutter={24}>
      <Col span={8}>
        <div className="mb-12">
          <Tooltip
            title="Managers have access to viewing Analytics, managing Team members, 
          editing Team, managing Member access etc "
          >
            <Space size={6}>
              <span>Select managers</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>
          {filterManagers.length ? (
            filterManagers.map((item) => {
              return (
                <Space className="member-list-item" key={item.id}>
                  <div>
                    <Space>
                      <img src={item.avatar} />
                      <p>{item.display_name || item.name}</p>
                    </Space>
                  </div>
                  <div>
                    <PlusCircleOutlined
                      onClick={() =>
                        setSelectedManagers([...selectedManagers, item])
                      }
                    />
                  </div>
                </Space>
              );
            })
          ) : (
            <p>No members</p>
          )}
        </div>
      </Col>
      <Col span={16}>
        <div>
          <p>Managers</p>
          {selectedManagers.length ? (
            selectedManagers.map((item) => {
              return (
                <Space className="member-list-item" key={item.id}>
                  <div>
                    <Space>
                      <img src={item.avatar} />
                      <p>{item.display_name || item.name}</p>
                    </Space>
                  </div>
                  <div>
                    <DeleteOutlined onClick={() => onDeselectManager(item)} />
                  </div>
                </Space>
              );
            })
          ) : (
            <p>No managers selected</p>
          )}
        </div>
        <Space size={20} className="mt-20">
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={() => onSubmit()}
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
