import { Button, Form, Input, Space } from "antd";
import { useEffect } from "react";

const TeamBasicInformationStep = ({ saving, teamDetail, onProceed }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(teamDetail);
  }, [teamDetail]);

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
            message: "Please enter team name",
          },
        ]}
      >
        <Input placeholder="Enter name" />
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
