import { useEffect, useState } from "react";
import { Button, Modal, Steps } from "antd";

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
      width={940}
      footer={null}
      visible={visible}
      title="Create new team"
      onCancel={() => onClose()}
      className="team-create-modal"
      destroyOnClose={true}
    >
      <Steps current={currentStep}>
        <Step title="Team Management" />
        <Step title="Employee Management" />
        <Step title="Manager Management" />
        <Step title="Check-In Management" />
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
