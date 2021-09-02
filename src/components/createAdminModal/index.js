import { useEffect, useState } from "react";
import { Modal, Form, Select, Space, Avatar } from "antd";

import { getAllSlackMembers, bulkSetSlackMemberAdmin } from "actions";

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
      getAllSlackMembers().then((response) => {
        setMembers(response.data.filter((item) => !item.is_admin));
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
      cancelText="Skip"
      visible={visible}
      confirmLoading={saving}
      onCancel={() => onClose()}
      onOk={() => form.submit()}
      title="Add Admins to your account?"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFormSubmit(values)}
      >
        <Form.Item
          name="member_ids"
          className="no-margin"
          label="Add admins who can edit and configure this account"
        >
          <Select
            showSearch
            size="large"
            mode="multiple"
            optionFilterProp="label"
          >
            {members.map((item) => {
              const name = item.display_name || item.name;
              return (
                <Select.Option key={item.id} value={item.id} label={name}>
                  <Space>
                    <Avatar src={item.avatar} />
                    <p>{name}</p>
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
