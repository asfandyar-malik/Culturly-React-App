import moment from "moment";
import { useEffect, useState } from "react";
import { Table, Form } from "antd";

import { getSurveys } from "../actions";
import { SURVEY_DAY_OPTIONS } from "../constants";

import SurveyEditModal from "./surveyEditModal";
import SurveyDetailModal from "./surveyDetailModal";

const SurveyManagement = () => {
  const [form] = Form.useForm();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surveysCount, setSurveysCount] = useState(0);
  const [selectedSurvey, setSelectedSurvey] = useState({});
  const [surveyDetailModalVisible, setSurveyDetailModalVisible] = useState(
    false
  );
  const [surveyEditModalVisible, setSurveyEditModalVisible] = useState(false);

  useEffect(() => {
    getSurveys().then((response) => {
      const { data } = response;
      setLoading(false);
      setSurveys(data.results);
      setSurveysCount(data.count);
    });
  }, []);

  function onViewQuesions(survey) {
    setSelectedSurvey(survey);
    setSurveyDetailModalVisible(true);
  }

  function onEditSurvey(survey) {
    setSelectedSurvey(survey);
    setSurveyEditModalVisible(true);
  }

  function onSurveyEdit(data) {
    const index = surveys.findIndex((item) => item.id === data.id);
    if (index > -1) {
      surveys[index] = { ...surveys[index], ...data };
      setSurveys([...surveys]);
    }
    setSurveyEditModalVisible(false);
  }

  function getSurveyDayDisplay(surveyDay) {
    const index = SURVEY_DAY_OPTIONS.findIndex(
      (item) => item.value == surveyDay
    );
    return SURVEY_DAY_OPTIONS[index].label;
  }

  const columns = [
    {
      key: "name",
      title: "Title",
      dataIndex: "name",
    },
    {
      key: "interval",
      title: "Interval",
      dataIndex: "interval_display",
    },
    {
      key: "active",
      title: "Active",
      render: (record) => (record.is_active ? "Active" : "Not active"),
    },
    {
      key: "schedule_on",
      title: "Schedule on",
      render: (record) => (
        <p>
          {record.interval === "daily" ? (
            <span>
              Every day on{" "}
              {moment(record.survey_time, "HH:mm::ss").format("HH:mm")}
            </span>
          ) : (
            <span>
              Every {getSurveyDayDisplay(record.survey_day)} on{" "}
              {moment(record.survey_time, "HH:mm::ss").format("HH:mm")}
            </span>
          )}
        </p>
      ),
    },
    {
      key: "no_of_questions",
      title: "No of questions",
      render: (record) => (
        <p>
          {record.no_of_questions}{" "}
          <span onClick={() => onViewQuesions(record)}>View questions</span>
        </p>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return <a onClick={() => onEditSurvey(record)}>Edit survey</a>;
      },
    },
  ];

  return (
    <>
      <Form form={form}>
        <Table
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={surveys}
          pagination={{ total: surveysCount }}
        />
      </Form>
      <SurveyDetailModal
        survey={selectedSurvey}
        visible={surveyDetailModalVisible}
        onClose={() => setSurveyDetailModalVisible(false)}
      />
      <SurveyEditModal
        survey={{ ...selectedSurvey }}
        visible={surveyEditModalVisible}
        onSave={(data) => onSurveyEdit(data)}
        onClose={() => setSurveyEditModalVisible(false)}
      />
    </>
  );
};

export default SurveyManagement;
