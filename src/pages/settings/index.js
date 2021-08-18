import { useEffect, useState } from "react";
import { Button, Form, message, Select } from "antd";

import { getTimezones, updateWorkspace } from "actions";

import AccountHook from "hooks/account";

import "./style.scss";

const WorkspaceSettings = ({ accountData, setAccountData }) => {
  const [form] = Form.useForm();
  const { workspace } = accountData;

  const [saving, setSaving] = useState(false);
  const [timezones, setTimezones] = useState([]);

  const hasWriteAccess = accountData?.member?.is_admin;

  useEffect(() => {
    getTimezones().then((response) => {
      setTimezones(response.data);
    });
    form.setFieldsValue({ timezone: workspace.timezone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values) => {
    setSaving(true);
    updateWorkspace(workspace.id, values)
      .then((response) => {
        accountData.workspace = response.data;
        setAccountData(accountData);
        setSaving(false);
        message.success("Settings saved");
      })
      .catch((err) => {
        setSaving(false);
      });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="settings-view"
      onFinish={onSubmit}
    >
      <Form.Item label="Timezone" name="timezone">
        <Select
          showSearch
          disabled={!hasWriteAccess}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {timezones.map((item, index) => {
            return (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <If condition={hasWriteAccess}>
        <Form.Item noStyle>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={saving}
          >
            Save
          </Button>
        </Form.Item>
      </If>
    </Form>
  );
};

export default AccountHook(WorkspaceSettings);
