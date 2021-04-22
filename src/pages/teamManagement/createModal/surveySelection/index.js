import { useEffect } from "react";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Form,
  TimePicker,
  Row,
  Space,
  Switch,
  Tag,
  Select,
  Input,
} from "antd";

import { isEmpty } from "_dash";
import { getTimezoneTime } from "utils";
import { SURVEY_DAY_OPTIONS } from "../../../../constants";

const TeamSurveySelectionStep = ({
  saving,
  timezone,
  teamDetail,
  surveys,
  onBack,
  onProceed,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    let initalValues = {};
    const teamSurveys = teamDetail.surveys;
    surveys.map((item) => {
      const surveyItem = teamSurveys.find((i) => i.survey.id === item.id) || {};
      const surveyTime = getTimezoneTime(
        surveyItem.survey_time || item.survey_time,
        timezone
      );
      initalValues[item.id] = {
        id: surveyItem.id,
        survey_time: moment(surveyTime, "HH:mm:ss"),
        survey_day: surveyItem.survey_day || item.survey_day,
        is_active: isEmpty(surveyItem) ? item.is_active : surveyItem.is_active,
      };
    });
    form.setFieldsValue(initalValues);
  }, [teamDetail]);

  function onFormSubmit(values) {
    let surveyArray = [];
    Object.keys(values).map((key) => {
      const item = values[key];
      const surveyTime = moment.utc(item.survey_time).format("HH:mm:ss");
      surveyArray.push({
        survey: {
          id: key,
        },
        id: item.id,
        survey_time: surveyTime,
        is_active: item.is_active,
        survey_day: item.survey_day,
      });
    });
    const payload = { surveys: surveyArray };
    onProceed(payload);
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => onFormSubmit(values)}
    >
      <Row gutter={32}>
        {surveys.map((item) => {
          return (
            <Col span={12} key={item.id}>
              <Card
                title={
                  <div>
                    <p>{item.name}</p>
                    <Space>
                      <p>{item.no_of_questions} questions</p>
                      <Tag color="green">{item.interval_display}</Tag>
                    </Space>
                  </div>
                }
              >
                <If condition={item.is_weekly_survey}>
                  <Form.Item label="Day" name={[item.id, "survey_day"]}>
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
                  name={[item.id, "survey_time"]}
                  extra={`Timezone: ${timezone}`}
                >
                  <TimePicker
                    format="HH:mm"
                    minuteStep={30}
                    allowClear={false}
                    showSecond={false}
                  />
                </Form.Item>
                <Form.Item
                  label="Is Active"
                  valuePropName="checked"
                  name={[item.id, "is_active"]}
                >
                  <Switch />
                </Form.Item>
                <Form.Item noStyle name={[item.id, "id"]}>
                  <Input type="hidden" />
                </Form.Item>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Form.Item noStyle>
        <Space size={20} className="mt-20">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={saving}
          >
            Continue
          </Button>
          <Button size="large" disabled={saving} onClick={() => onBack()}>
            Back
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TeamSurveySelectionStep;
