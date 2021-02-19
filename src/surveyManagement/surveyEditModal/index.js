import moment from "moment";
import { useEffect, useState } from "react";
import { Modal, TimePicker, Form, Select, Switch, Row, Col } from "antd";

import { isEmpty } from "../../_dash";
import { updateSurveyForWorkspace } from "../../actions";
import { SURVEY_DAY_OPTIONS, SURVEY_WEEKLY_INTERVAL } from "../../constants";

import "./style.scss";

const SurveyEditModal = ({ visible, survey, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && !isEmpty(survey)) {
      survey.survey_time = moment(survey.survey_time, "HH:mm:ss");
      survey.email_report_time = moment(survey.email_report_time, "HH:mm:ss");
      form.setFieldsValue(survey);
    }
  }, [visible]);

  function onFormSubmit(values) {
    setSaving(true);
    values.survey = survey.id;
    values.survey_time = values.survey_time.format("HH:mm:ss");
    values.email_report_time = values.email_report_time.format("HH:mm:ss");
    updateSurveyForWorkspace(values, survey.workspace_survey_id)
      .then((response) => {
        let { data } = response;
        data["workspace_survey_id"] = data.id;
        data["id"] = survey.id;
        onSave(response.data);
        setSaving(false);
      })
      .catch((err) => {
        setSaving(false);
      });
  }

  return (
    <Modal
      visible={visible}
      confirmLoading={saving}
      onCancel={() => onClose()}
      onOk={() => form.submit()}
      title={`Edit ${survey?.name}`}
      className="survey-edit-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onFormSubmit(values)}
      >
        <Row gutter={32}>
          {survey.interval === SURVEY_WEEKLY_INTERVAL ? (
            <Col span={12}>
              <Form.Item label="Day" name="survey_day">
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
            </Col>
          ) : (
            ""
          )}
          <Col span={12}>
            <Form.Item label="Schedule" name="survey_time">
              <TimePicker
                format="HH:mm"
                minuteStep={30}
                allowClear={false}
                showSecond={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email Report time" name="email_report_time">
              <TimePicker
                format="HH:mm"
                minuteStep={30}
                allowClear={false}
                showSecond={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Is Active"
              valuePropName="checked"
              name="is_active"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SurveyEditModal;
