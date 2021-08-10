import { useEffect, useState } from "react";
import { Modal, Form, Select, Space, Avatar } from "antd";

import { getSlackMembers, bulkSetSlackMemberAdmin } from "actions";

const CreateAdminModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSaving(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      getSlackMembers().then((response) => {
        setMembers(
          response.data.results.filter(
            (item) => item.is_active && !item.is_admin
          )
        );
      });
    }
  }, [visible]);

  function onFormSubmit(values) {
    if (values.member_ids) {
      setSaving(true);
      bulkSetSlackMemberAdmin(values).then((response) => {
        onClose();
      });
    } else {
      onClose();
    }
  }

  return (
    <Modal
      okText="Proceed"
      visible={visible}
      confirmLoading={saving}
      onCancel={() => onClose()}
      onOk={() => form.submit()}
      title="Who are the admins of your account?"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFormSubmit(values)}
      >
        <Form.Item
          name="member_ids"
          className="no-margin"
          label="Share permissions to view and edit data in your account with some of your team members"
        >
          <Select
            showSearch
            size="large"
            mode="multiple"
            optionFilterProp="label"
          >
            {members.map((item) => {
              return (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  label={item.display_name}
                >
                  <Space>
                    <Avatar src={item.avatar} />
                    <p>{item.display_name}</p>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAdminModal;
