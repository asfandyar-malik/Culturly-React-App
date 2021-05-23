import { useEffect, useState } from "react";
import moment from "moment";
import { Button, Card, Form, Space, Tooltip, Input } from "antd";

import { QuestionCircleOutlined } from "@ant-design/icons";

import { isEmpty, groupBy } from "_dash";
import { getTimezoneTime } from "utils";
import { SURVEY_TYPE_DISPLAY_MAPPING } from "../../../../constants";

import SurveyFormItem from "./surveyFormItem";

const TeamSurveySelectionStep = ({
  saving,
  timezone,
  teamDetail,
  surveys,
  onBack,
  onProceed,
}) => {
  const [form] = Form.useForm();
  const [surveyGroup, setSurveyGroup] = useState({});

  useEffect(() => {
    let initalValues = {};
    const teamSurveys = teamDetail.surveys || [];
    const surveyGroup = groupBy(surveys, (c) => c.survey_type);
    const pulseSurveys = groupBy(teamSurveys, (c) => c.is_pulse_check)["true"];

    if (pulseSurveys && pulseSurveys.length) {
      const surveyTime = getTimezoneTime(pulseSurveys[0].survey_time, timezone);
      initalValues["pulse"] = {
        survey_day: pulseSurveys[0].survey_day,
        survey_time: moment(surveyTime, "HH:mm:ss"),
      };
    } else {
      if (surveyGroup.pulse && surveyGroup.pulse.length) {
        const surveyTime = getTimezoneTime(
          surveyGroup.pulse[0].survey_time,
          timezone
        );
        initalValues["pulse"] = {
          survey_day: surveyGroup.pulse[0].survey_day,
          survey_time: moment(surveyTime, "HH:mm:ss"),
        };
      }
    }

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

    setSurveyGroup(surveyGroup);
    form.setFieldsValue(initalValues);
  }, [teamDetail]);

  function onFormSubmit(values) {
    let surveyArray = [];
    const { pulse, ...happinessValues } = values;
    const pulseSurveys = surveyGroup.pulse;

    Object.keys(happinessValues).map((key) => {
      const item = values[key];
      const surveyTime = moment.utc(item.survey_time).format("HH:mm:ss");
      surveyArray.push({
        survey: {
          id: key,
        },
        id: item.id,
        is_active: true,
        survey_time: surveyTime,
        survey_day: item.survey_day,
      });
    });

    Object.keys(pulseSurveys).map((key) => {
      const item = pulseSurveys[key];
      const surveyTime = moment.utc(pulse.survey_time).format("HH:mm:ss");
      const surveyItem =
        (teamDetail.surveys || []).find((i) => i.survey.id === item.id) || {};
      surveyArray.push({
        survey: {
          id: item.id,
        },
        id: surveyItem.id,
        is_active: true,
        survey_time: surveyTime,
        survey_day: pulse.survey_day,
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
      className="survey-selection-form"
      onFinish={(values) => onFormSubmit(values)}
    >
      {Object.keys(surveyGroup).map((key) => {
        const keysurveys = surveyGroup[key];
        return (
          <Card
            key={key}
            className="survey-group-card"
            extra={`${keysurveys.length} surveys`}
            title={`${SURVEY_TYPE_DISPLAY_MAPPING[key]}`}
          >
            <Choose>
              <When condition={key === "happiness"}>
                {keysurveys.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      bordered={false}
                      className="survey-card"
                      title={
                        <Tooltip title={item.name}>
                          <Space size={6}>
                            <span>{item.name}</span>
                            <QuestionCircleOutlined />
                          </Space>
                        </Tooltip>
                      }
                    >
                      <SurveyFormItem
                        timezone={timezone}
                        dayItemName={[item.id, "survey_day"]}
                        timeItemName={[item.id, "survey_time"]}
                      />
                      <Form.Item noStyle name={[item.id, "id"]}>
                        <Input type="hidden" />
                      </Form.Item>
                    </Card>
                  );
                })}
              </When>
              <Otherwise>
                <SurveyFormItem
                  showDay
                  timezone={timezone}
                  dayItemName={[key, "survey_day"]}
                  timeItemName={[key, "survey_time"]}
                />
              </Otherwise>
            </Choose>
          </Card>
        );
      })}
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
