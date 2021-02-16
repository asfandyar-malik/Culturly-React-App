import { Modal, Button } from "antd";

const SurveyDetailModal = ({ visible, survey, onClose }) => {
  return (
    <Modal
      visible={visible}
      onCancel={() => onClose()}
      title={`${survey?.name} questions`}
      footer={
        <Button type="primary" onClick={() => onClose()}>
          Ok
        </Button>
      }
    >
      {survey.questions && survey.questions.length ? (
        survey.questions.map((question) => {
          return (
            <div key={question.id}>
              <p>{question.title}</p>
              {question.options.map((option, index) => {
                return <p key={index}>{option.label}</p>;
              })}
              <p>
                Is primary question:{" "}
                {question.is_primary_question ? "Yes" : "No"}
              </p>
              {question.next_question ? (
                <p>Next question: {question.next_question}</p>
              ) : (
                ""
              )}
            </div>
          );
        })
      ) : (
        <p>No questions</p>
      )}
    </Modal>
  );
};

export default SurveyDetailModal;
