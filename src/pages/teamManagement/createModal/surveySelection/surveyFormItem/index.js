import { Form, TimePicker, Select, Tooltip, Space, Row, Col } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { SURVEY_DAY_OPTIONS } from "../../../../../constants";

const SurveyFormItem = ({ showDay, dayItemName, timeItemName, timezone }) => {
  return (
    <Row gutter={20}>
      <If condition={showDay}>
        <Col span={12}>
          <Form.Item label="Day" name={dayItemName}>
            <Select size="large">
              {SURVEY_DAY_OPTIONS.map((item) => {
                return (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </If>
      <Col span={12}>
        <Form.Item
          label={
            <Space size={6}>
              <span>Schedule</span>
              <Tooltip
                title="All members are sent these checkins at this time, 
            in their timezone e.g Team member in Europe & China both 
            receive it at 10:00 their time"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
          name={timeItemName}
          extra={<p className="mt-4">{`Timezone: ${timezone}`}</p>}
        >
          <TimePicker
            size="large"
            format="HH:mm"
            minuteStep={30}
            className="w-full"
            allowClear={false}
            showSecond={false}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default SurveyFormItem;
