import { useEffect, useState } from "react";
import { Button, Modal, Space, Steps, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import {
  createWorkspaceTeam,
  updateWorkspaceTeam,
  getWorkspaceRemainingTeamMembers,
  getWorkspaceRemainingTeamManagers,
} from "actions";

import AccountHook from "hooks/account";
import TeamMemberSelectionStep from "./memberSelection";
import TeamManagerSelectionStep from "./managerSelection";
import TeamSurveySelectionStep from "./surveySelection";
import TeamBasicInformationStep from "./basicInformation";

import "./style.scss";

const { Step } = Steps;

const CreateTeamModal = ({
  accountData,
  visible,
  surveys,
  selectedTeam,
  onUpdateTeam,
  onClose,
}) => {
  const timezone = accountData?.workspace?.timezone;

  const [members, setMembers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [teamDetail, setTeamDetail] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) {
      getWorkspaceRemainingTeamMembers().then((response) => {
        setMembers(response.data);
      });
      getWorkspaceRemainingTeamManagers().then((response) => {
        setManagers(response.data);
      });
    } else {
      setCurrentStep(0);
    }
  }, [visible]);

  useEffect(() => {
    setTeamDetail(selectedTeam);
  }, [selectedTeam]);

  const onSubmit = (payload) => {
    let func = null;
    setSaving(true);
    const { id } = teamDetail;
    if (id) {
      func = updateWorkspaceTeam(id, payload);
    } else {
      func = createWorkspaceTeam(payload);
    }

    func.then((response) => {
      const { data } = response;
      setSaving(false);
      onUpdateTeam(data);
      setTeamDetail(data);
      setCurrentStep(currentStep + 1);
    });
  };

  return (
    <Modal
      width={1000}
      footer={null}
      visible={visible}
      title="Create new team"
      onCancel={() => onClose()}
      className="team-create-modal"
      destroyOnClose={true}
    >
      <Steps current={currentStep}>
        <Step
          title={
            <Space>
              Team Management
              <Tooltip
                title="Select all teams in your company. You can 
              add additional teams that are not listed here."
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
        />
        <Step
          title={
            <Space>
              Employees
              <Tooltip
                title="Allocate employees to the team they belong to. In 
                the analytic section, you can later filter based on indiviual teams."
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
        />
        <Step
          title={
            <Space>
              Managers
              <Tooltip
                title="Allocate managers to the team they are managing. Managers can see 
                analytics and book activities for their indiviual team."
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
        />
        <Step
          title={
            <Space>
              Check-In
              <Tooltip
                title="Manage the timing of the check-ins that are sent to team members. Culture 
                checks are sent on a weekly basis and happiness checks are sent on a daily basis.
                Note: Average time to answer all checkins in 52s on a weekly basis. 
                <-- Note has to be written in Italic."
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
        />
      </Steps>
      <div className="mt-24">
        <Choose>
          <When condition={currentStep === 0}>
            <TeamBasicInformationStep
              saving={saving}
              teamDetail={teamDetail}
              onProceed={(payload) => onSubmit(payload)}
            />
          </When>
          <When condition={currentStep === 1}>
            <TeamMemberSelectionStep
              saving={saving}
              members={members}
              teamDetail={teamDetail}
              onProceed={(payload) => onSubmit(payload)}
              onBack={() => setCurrentStep(currentStep - 1)}
            />
          </When>
          <When condition={currentStep === 2}>
            <TeamManagerSelectionStep
              saving={saving}
              managers={managers}
              teamDetail={teamDetail}
              onProceed={(payload) => onSubmit(payload)}
              onBack={() => setCurrentStep(currentStep - 1)}
            />
          </When>
          <When condition={currentStep === 3}>
            <TeamSurveySelectionStep
              saving={saving}
              surveys={surveys}
              timezone={timezone}
              teamDetail={teamDetail}
              onProceed={(payload) => onSubmit(payload)}
              onBack={() => setCurrentStep(currentStep - 1)}
            />
          </When>
          <Otherwise>
            <div className="mar-t-24 text-center">
              <p className="font-bold text-xl mar-b-12">
                Team created successfully
              </p>
              <Button onClick={() => onClose()}>Close</Button>
            </div>
          </Otherwise>
        </Choose>
      </div>
    </Modal>
  );
};

export default AccountHook(CreateTeamModal);
