import { useEffect, useState } from "react";
import { Button, Form, Input, Space, Select, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { DFFAULT_TEAM_NAMES } from "../../../../constants";

const { Option } = Select;

const TeamBasicInformationStep = ({ saving, teamDetail, onProceed }) => {
  const [form] = Form.useForm();
  const [teamItems, setTeamItems] = useState(DFFAULT_TEAM_NAMES);
  const [customItemValue, setCustomItemValue] = useState("");

  useEffect(() => {
    form.setFieldsValue(teamDetail);
  }, [teamDetail]);

  function addItem() {
    if (teamItems.indexOf(customItemValue) === -1) {
      setTeamItems([...teamItems, customItemValue]);
      setCustomItemValue("");
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => onProceed(values)}
    >
      <Form.Item
        name="name"
        label="Team name"
        rules={[
          {
            required: true,
            message: "Please select team name",
          },
        ]}
      >
        <Select
          size="large"
          placeholder="Select category"
          dropdownClassName="team-selection-dropdown"
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider />
              <div className="add-new">
                <Input
                  value={customItemValue}
                  onChange={(e) => setCustomItemValue(e.target.value)}
                />
                <a onClick={() => addItem()}>
                  <PlusOutlined /> Add team
                </a>
              </div>
            </div>
          )}
        >
          {teamItems.map((item) => (
            <Option key={item}>{item}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item noStyle>
        <Space size={20}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={saving}
          >
            Continue
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TeamBasicInformationStep;
