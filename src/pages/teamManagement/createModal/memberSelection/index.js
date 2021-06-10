import { useEffect, useState } from "react";
import { Col, Row, Space, Button, Tooltip, message } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const TeamMemberSelectionStep = ({
  saving,
  members,
  teamDetail,
  onBack,
  onProceed,
}) => {
  const [allMembers, setAllMembers] = useState([]);
  const [filterMembers, setFilterMembers] = useState([]);
  const [isInitalLoaded, setIsInitalLoaded] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    setAllMembers(members);
    setFilterMembers(members);
    setSelectedMembers(teamDetail.members.map((item) => item.member));
    setIsInitalLoaded(true);
  }, [members, teamDetail]);

  useEffect(() => {
    if (isInitalLoaded) {
      let newMembers = [...allMembers];
      newMembers = newMembers.filter(
        (item) => !selectedMembers.map((i) => i.id).includes(item.id)
      );
      setFilterMembers([...newMembers]);
    }
  }, [selectedMembers]);

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

  function onSubmit() {
    if (selectedMembers.length) {
      const memberArrary = selectedMembers.map((item) => {
        return {
          id: getExistingMemberId(item.id),
          member: {
            id: item.id,
          },
        };
      });
      const payload = {
        members: memberArrary,
      };
      onProceed(payload);
    } else {
      message.error("Please select members");
    }
  }

  return (
    <Row gutter={24}>
      <Col span={8}>
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
