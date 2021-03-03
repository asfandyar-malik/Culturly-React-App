import { Button, Form, message, Select } from "antd";
import { useEffect, useState } from "react";

import { getTimezones, updateWorkspace } from "../actions";

import AccountHook from "../hooks/account";

import "./style.scss";

const Settings = ({ accountData, setAccountData }) => {
  const [form] = Form.useForm();
  const { workspace } = accountData;
  const isManager = accountData.member.is_manager;

  const [saving, setSaving] = useState(false);
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    getTimezones().then((response) => {
      setTimezones(response.data);
    });
    form.setFieldsValue({ timezone: workspace.timezone });
  }, []);

  function onSubmit(values) {
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
  }

  return (
    <Form
      form={form}
      layout="vertical"
      className="settings-view"
      onFinish={(values) => onSubmit(values)}
    >
      <Form.Item label="Timezone" name="timezone">
        <Select
          showSearch
          disabled={!isManager}
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
      <If condition={isManager}>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form.Item>
      </If>
    </Form>
  );
};

export default AccountHook(Settings);
