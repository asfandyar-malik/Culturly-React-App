import { useEffect, useState } from "react";
import { Avatar, Col, List, Row, Space, Tag, Menu, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

import { getSlackMembers, updateSlackMember } from "actions";

import "./style.scss";

const MemberManagement = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getSlackMembers().then((response) => {
      setLoading(false);
      setMembers(response.data.results);
    });
  }, []);

  function updateMemberItem(member) {
    const index = members.findIndex((item) => item.id === member.id);
    members[index] = member;
    setMembers([...members]);
  }

  const onToggleManager = (record) => {
    const payload = {
      is_manager: !record.is_manager,
    };
    updateSlackMember(record.id, payload).then((response) => {
      updateMemberItem(response.data);
    });
  };

  const onToggleActive = (record) => {
    const payload = {
      is_active: !record.is_active,
    };
    updateSlackMember(record.id, payload).then((response) => {
      updateMemberItem(response.data);
    });
  };

  return (
    <List
      loading={loading}
      dataSource={members}
      className="common-list member-management"
      header={
        <Row gutter={32}>
          <Col span={6}>Member Name</Col>
          <Col span={4}>Status</Col>
          <Col span={4}>Is manager</Col>
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
            <Col span={4}>
              <Tag color={item.is_active ? "green" : "red"}>
                {item.is_active ? "Active" : "Not active"}
              </Tag>
            </Col>
            <Col span={4}>{item.is_manager ? "Yes" : "No"}</Col>
            <Col span={10}>
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => onToggleActive(item)}>
                      {item.is_active ? "Set inactive" : "Set active"}
                    </Menu.Item>
                    <Menu.Item onClick={() => onToggleManager(item)}>
                      {item.is_manager ? "Remove as manager" : "Set as manager"}
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
  );
};

export default MemberManagement;
