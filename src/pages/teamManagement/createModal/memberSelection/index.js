import { useEffect, useState } from "react";
import { Col, Row, Space, Button, Tooltip, message, Input, Avatar } from "antd";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMembers]);

  function onSearch(value) {
    let newMembers = [...allMembers];
    newMembers = newMembers.filter(
      (item) => !selectedMembers.map((i) => i.id).includes(item.id)
    );
    if (value) {
      const searchMembers = newMembers.filter(
        (item) =>
          item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.display_name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
      setFilterMembers([...searchMembers]);
    } else {
      setFilterMembers([...newMembers]);
    }
  }

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
    <Row gutter={32}>
      <Col span={8}>
        <Tooltip
          title="Members receive Mood Check Survey and Culture check Survey on Slack. 
          One member can be part of only one Team"
        >
          <Space size={6}>
            <p className="text-2xl">Select members</p>
            <QuestionCircleOutlined />
          </Space>
        </Tooltip>
        <Input.Search
          size="large"
          className="mt-16 mb-16"
          style={{ width: "100%" }}
          placeholder="Enter to search members"
          onSearch={(value) => onSearch(value)}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Choose>
          <When condition={filterMembers.length}>
            <div className="members-list">
              {filterMembers.map((item) => {
                const name = item.display_name || item.name;
                return (
                  <Space className="member-list-item" key={item.id}>
                    <Space>
                      <Avatar size={44} src={item.avatar} />
                      <p className="text-xl secondary medium">{name}</p>
                    </Space>
                    <PlusCircleOutlined
                      onClick={() =>
                        setSelectedMembers([...selectedMembers, item])
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
        <p className="text-2xl">Selected members</p>
        <Choose>
          <When condition={selectedMembers.length}>
            <div className="selected-item-list">
              {selectedMembers.map((item) => {
                const name = item.display_name || item.name;
                return (
                  <Space className="member-list-item" key={item.id}>
                    <Space>
                      <Avatar size={44} src={item.avatar} />
                      <p className="text-xl secondary medium">{name}</p>
                    </Space>
                    <DeleteOutlined onClick={() => onDeselectMember(item)} />
                  </Space>
                );
              })}
            </div>
          </When>
          <Otherwise>
            <p className="text-2xl secondary">No members selected</p>
          </Otherwise>
        </Choose>
        <Space size={20} className="mt-24">
          <Button
            size="large"
            type="primary"
            loading={saving}
            onClick={() => onSubmit()}
            disabled={!selectedMembers.length}
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
