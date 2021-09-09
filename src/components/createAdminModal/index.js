import { useEffect, useState } from "react";
import { Modal, Form, Select, Space, Avatar, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

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
      width={500}
      okText="Proceed"
      cancelText="Skip"
      visible={visible}
      confirmLoading={saving}
      onCancel={() => onClose()}
      onOk={() => form.submit()}
      title={
        <div className="text-left">
          <span>Who are the admins of your account?</span>
          <Tooltip
            title={
              <div>
                Admins have administrative rights. This means that they can do
                changes in Culturly, manager members and see culture analytics
                for the company level and for all indiviual teams. Note: In most
                cases, administrators are members from
                <i>
                  HR, People & Culture, Office Managers or C-Level managers.
                </i>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ paddingLeft: "0.8rem" }} />
          </Tooltip>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFormSubmit(values)}
      >
        <Form.Item
          name="member_ids"
          className="no-margin"
          label="Select your administrators. Admin rights include to view 
          analytics for all teams."
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
