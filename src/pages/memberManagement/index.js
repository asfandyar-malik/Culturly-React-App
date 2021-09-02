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
  Input,
  Select,
} from "antd";
import { EllipsisOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { getSlackMembers, updateSlackMember } from "actions";

import AccountHook from "hooks/account";
import useDebounce from "hooks/debounce";

import "./style.scss";

const MemberManagement = ({ accountData }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginating, setPaginating] = useState(false);
  const [isAdminFilter, setIsAdminFilter] = useState("");
  const [isManagerFilter, setIsManagerFilter] = useState("");

  const hasWriteAccess = accountData?.member?.is_admin;
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  function getMembers(page = currentPage) {
    setPaginating(true);
    const queryParams = {
      page,
      search: searchTerm,
      ...(isAdminFilter ? { is_admin: isAdminFilter } : {}),
      ...(isManagerFilter ? { is_manager: isManagerFilter } : {}),
    };
    const queryString = new URLSearchParams(queryParams).toString();
    if (page === 1) {
      setLoading(true);
    }
    getSlackMembers(queryString).then((response) => {
      const { data } = response;
      setLoading(false);
      setPaginating(false);
      setCurrentPage(page);
      setHasMore(!!data.next);
      if (page === 1) {
        setMembers(data.results);
      } else {
        setMembers([...members, ...data.results]);
      }
    });
  }

  useEffect(() => {
    getMembers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, isAdminFilter, isManagerFilter]);

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
      <Row className="mb-16" justify="space-between">
        <Col>
          <Input.Search
            allowClear
            size="large"
            disabled={loading}
            style={{ width: 300 }}
            placeholder="Search by member name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Space size={16}>
            <Select
              size="large"
              defaultValue=""
              disabled={loading}
              style={{ width: 175 }}
              onChange={(value) => setIsManagerFilter(value)}
            >
              <Select.Option value="">Manager Filter</Select.Option>
              <Select.Option value="true">Manager</Select.Option>
              <Select.Option value="false">Not Manager</Select.Option>
            </Select>
            <Select
              size="large"
              defaultValue=""
              disabled={loading}
              style={{ width: 150 }}
              onChange={(value) => setIsAdminFilter(value)}
            >
              <Select.Option value="">Admin Filter</Select.Option>
              <Select.Option value="true">Admin</Select.Option>
              <Select.Option value="false">Not Admin</Select.Option>
            </Select>
          </Space>
        </Col>
      </Row>
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
          onClick={() => getMembers(currentPage + 1)}
        >
          Load more
        </Button>
      </If>
    </div>
  );
};

export default AccountHook(MemberManagement);
