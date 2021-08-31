import { useEffect, useState } from "react";
import {
  Avatar,
  Col,
  List,
  Row,
  Space,
  Tag,
  Menu,
  Dropdown,
  Tooltip,
  Button,
} from "antd";
import { EllipsisOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { getSlackMembers, updateSlackMember } from "actions";

import AccountHook from "hooks/account";

import "./style.scss";

const MemberManagement = ({ accountData }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hasWriteAccess = accountData?.member?.is_admin;

  useEffect(() => {
    setPaginating(true);
    getSlackMembers(currentPage).then((response) => {
      const { data } = response;
      setLoading(false);
      setPaginating(false);
      setHasMore(!!data.next);
      setMembers([...members, ...data.results]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  function updateMemberItem(member) {
    const index = members.findIndex((item) => item.id === member.id);
    members[index] = member;
    setMembers([...members]);
  }

  const onToggleManager = (record) => {
    const payload = {
      is_admin: false,
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

  const onToggleAdmin = (record) => {
    const payload = {
      is_admin: !record.is_admin,
      is_manager: record.is_admin ? record.is_manager : true,
    };
    updateSlackMember(record.id, payload).then((response) => {
      updateMemberItem(response.data);
    });
  };

  return (
    <div className="member-management max-container">
      <List
        loading={loading}
        dataSource={members}
        className="common-list"
        header={
          <Row gutter={32}>
            <Col span={5}>Member Name</Col>
            <Col span={4}>Status</Col>
            <Col span={3}>Admin</Col>
            <Col span={4}>
              <Tooltip
                title="Managers have access to create Teams, Edit Surveys, 
            Edit user access, View Analytics etc "
              >
                <Space size={6}>
                  <span>Manager</span>
                  <QuestionCircleOutlined />
                </Space>
              </Tooltip>
            </Col>
            <Col span={5}>Team</Col>
          </Row>
        }
        renderItem={(item) => (
          <List.Item>
            <Row gutter={32} className="font-medium">
              <Col span={5}>
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
              <Col span={3}>{item.is_admin ? "Yes" : "No"}</Col>
              <Col span={4}>{item.is_manager ? "Yes" : "No"}</Col>
              <Col span={5}>{item.team || "-"}</Col>
              <Choose>
                <When condition={hasWriteAccess && !item.is_myself}>
                  <Col span={3}>
                    <Dropdown
                      trigger={["click"]}
                      overlay={
                        <Menu>
                          <Menu.Item onClick={() => onToggleActive(item)}>
                            {item.is_active ? "Set inactive" : "Set active"}
                          </Menu.Item>
                          <Menu.Item onClick={() => onToggleManager(item)}>
                            {item.is_manager
                              ? "Remove as manager"
                              : "Set as manager"}
                          </Menu.Item>
                          <Menu.Item onClick={() => onToggleAdmin(item)}>
                            {item.is_admin ? "Remove as admin" : "Set as admin"}
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <EllipsisOutlined rotate={90} />
                    </Dropdown>
                  </Col>
                </When>
                <Otherwise>
                  <Col span={3} />
                </Otherwise>
              </Choose>
            </Row>
          </List.Item>
        )}
      />
      <If condition={hasMore && members.length}>
        <Button
          loading={paginating}
          className="load-more"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Load more
        </Button>
      </If>
    </div>
  );
};

export default AccountHook(MemberManagement);
