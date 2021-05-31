import { useEffect, useState } from "react";
import { Col, Row, Space, Button, Tooltip } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const TeamMemberSelectionStep = ({
  saving,
  members,
  managers,
  teamDetail,
  onBack,
  onProceed,
}) => {
  const [allMembers, setAllMembers] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [filterMembers, setFilterMembers] = useState([]);
  const [filterManagers, setFilterManagers] = useState([]);

  const [isInitalLoaded, setIsInitalLoaded] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  useEffect(() => {
    setAllMembers(members);
    setAllManagers(managers);
    setFilterMembers(members);
    setFilterManagers(managers);
    setSelectedMembers(teamDetail.members.map((item) => item.member));
    setSelectedManagers(teamDetail.managers.map((item) => item.member));
    setIsInitalLoaded(true);
  }, [members, teamDetail]);

  useEffect(() => {
    if (isInitalLoaded) {
      let newMembers = [...allMembers];
      let newManagers = [...allManagers];
      newMembers = newMembers.filter(
        (item) => !selectedMembers.map((i) => i.id).includes(item.id)
      );
      newManagers = newManagers.filter(
        (item) => !selectedManagers.map((i) => i.id).includes(item.id)
      );
      setFilterMembers([...newMembers]);
      setFilterManagers([...newManagers]);
    }
  }, [selectedMembers, selectedManagers]);

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

  const onDeselectMember = (member) => {
    const index = selectedMembers.findIndex((item) => item.id === member.id);
    if (index > -1) {
      const memberIndex = allMembers.findIndex((item) => item.id === member.id);
      if (memberIndex === -1) {
        allMembers.push(member);
        setAllMembers(allMembers);
      }
      selectedMembers.splice(index, 1);
      setSelectedMembers([...selectedMembers]);
    }
  };

  function getExistingMemberId(memberId) {
    const teamMembers = teamDetail.members;
    const member = teamMembers.find((item) => item.member.id === memberId);
    return member ? member.id : null;
  }

  function getExistingManagerId(memberId) {
    const teamMembers = teamDetail.managers;
    const member = teamMembers.find((item) => item.member.id === memberId);
    return member ? member.id : null;
  }

  function onSubmit() {
    const memberArrary = selectedMembers.map((item) => {
      return {
        id: getExistingMemberId(item.id),
        member: {
          id: item.id,
        },
      };
    });
    const managerArrary = selectedManagers.map((item) => {
      return {
        id: getExistingManagerId(item.id),
        member: {
          id: item.id,
        },
      };
    });
    const payload = {
      members: memberArrary,
      managers: managerArrary,
    };
    onProceed(payload);
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
        <div>
          <Tooltip
            title="Members receive Mood Check Survey and Culture check Survey on Slack. 
          One member can be part of only one Team"
          >
            <Space size={6}>
              <span>Select members</span>
              <QuestionCircleOutlined />
            </Space>
          </Tooltip>
          {filterMembers.length ? (
            filterMembers.map((item) => {
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
                        setSelectedMembers([...selectedMembers, item])
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
        <div className="mt-12">
          <p>Members</p>
          {selectedMembers.length ? (
            selectedMembers.map((item) => {
              return (
                <Space className="member-list-item" key={item.id}>
                  <div>
                    <Space>
                      <img src={item.avatar} />
                      <p>{item.display_name || item.name}</p>
                    </Space>
                  </div>
                  <div>
                    <DeleteOutlined onClick={() => onDeselectMember(item)} />
                  </div>
                </Space>
              );
            })
          ) : (
            <p>No members selected</p>
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

export default TeamMemberSelectionStep;
