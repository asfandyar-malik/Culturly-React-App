import { Table, Space } from "antd";
import { useEffect, useState } from "react";

import { getSlackMembers, updateSlackMember } from "../actions";

import AccountHook from "../hooks/account";

const MemberManagement = ({ accountData }) => {
  const { member } = accountData;
  const isManager = accountData.member.is_manager;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersCount, setMembersCount] = useState(0);

  useEffect(() => {
    getSlackMembers().then((response) => {
      const { data } = response;
      setLoading(false);
      setMembers(data.results);
      setMembersCount(data.count);
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

  const columns = [
    {
      key: "name",
      title: "Member Name",
      render: (record) => record.name || record.display_name,
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "is_manager",
      title: "Is Manager",
      render: (record) => (record.is_manager ? "Yes" : "No"),
    },
    {
      key: "is_active",
      title: "Is Active",
      render: (record) => (record.is_active ? "Yes" : "No"),
    },
    isManager
      ? {
          key: "actions",
          title: "Actions",
          render: (record) => {
            return (
              <Space size="middle">
                {member.is_admin && member.email !== record.email ? (
                  <a onClick={() => onToggleManager(record)}>
                    {record.is_manager ? "Remove as manager" : "Set as manager"}
                  </a>
                ) : (
                  ""
                )}
                <a onClick={() => onToggleActive(record)}>
                  {record.is_active ? "Make inactive" : "Set active"}
                </a>
              </Space>
            );
          },
        }
      : {},
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={loading}
      dataSource={members}
      pagination={{ total: membersCount }}
    />
  );
};

export default AccountHook(MemberManagement);
