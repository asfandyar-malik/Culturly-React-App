import { Form, TimePicker, Select } from "antd";

import { SURVEY_DAY_OPTIONS } from "../../../../../constants";

const SurveyFormItem = ({ showDay, dayItemName, timeItemName, timezone }) => {
  return (
    <>
      <If condition={showDay}>
        <Form.Item label="Day" name={dayItemName}>
          <Select>
            {SURVEY_DAY_OPTIONS.map((item) => {
              return (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </If>
      <Form.Item
        label="Schedule"
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
    </>
  );
};

export default SurveyFormItem;
