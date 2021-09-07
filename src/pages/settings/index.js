import { useEffect, useState } from "react";
import {
  Button,
  Form,
  message,
  Select,
  Switch,
  Space,
  Avatar,
  Row,
  Col,
  Tooltip,
  InputNumber,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  getTimezones,
  getCountries,
  updateProfile,
  updateWorkspace,
} from "actions";

import AccountHook from "hooks/account";

import "./style.scss";

const WorkspaceSettings = ({ accountData, setAccountData }) => {
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const { workspace, member } = accountData;

  const [saving, setSaving] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [countries, setCountries] = useState([]);
  const [profileSaving, setProfileSaving] = useState(false);

  const hasWriteAccess = accountData?.member?.is_admin;

  useEffect(() => {
    getTimezones().then((response) => {
      setTimezones(response.data);
    });
    getCountries().then((response) => {
      setCountries(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      offices: workspace.offices,
      timezone: workspace.timezone,
      is_leaderboard_enabled: workspace.is_leaderboard_enabled,
      minimum_anonymity_threshold: workspace.minimum_anonymity_threshold,
    });
    profileForm.setFieldsValue({
      member: {
        office: member.office,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData]);

  const onSubmit = (values) => {
    const payload = { ...values };
    const { offices = [] } = payload;
    offices.forEach((item) => {
      item.cities = item.cities.map((i) => {
        return {
          name: i,
        };
      });
    });
    payload.offices = offices;
    setSaving(true);
    updateWorkspace(workspace.id, payload)
      .then((response) => {
        const { data } = response;
        (data.offices || []).forEach((item) => {
          item.cities = item.cities.map((i) => i.name);
        });
        setSaving(false);
        accountData.workspace = data;
        setAccountData({ ...accountData });
        message.success("Settings saved");
      })
      .catch((err) => {
        setSaving(false);
      });
  };

  const onProfileSubmit = (values) => {
    setProfileSaving(true);
    updateProfile(values).then((response) => {
      setProfileSaving(false);
      setAccountData({ ...response.data });
      message.success("Profile updated");
    });
  };

  return (
    <Row className="settings-view max-container" gutter={48}>
      <Col span={12}>
        <p className="text-2xl uppercase medium mb-16">Workspace settings</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onSubmit(values)}
        >
          <Form.Item label="Timezone" name="timezone">
            <Select
              showSearch
              disabled={!hasWriteAccess}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {timezones.map((item, index) => {
                return (
                  <Select.Option value={item} key={index}>
                    {item}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            label={
              <Space size={12}>
                <p className="text-2xl medium">Enable leaderboard </p>
                <Tooltip
                  title="Enabling the user board will show the users who are most active 
                with their feedback without compromising on their anonymity. It is an optional feature"
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            name="is_leaderboard_enabled"
          >
            <Switch disabled={!hasWriteAccess} />
          </Form.Item>
          <If condition={hasWriteAccess}>
            <Form.Item
              name="minimum_anonymity_threshold"
              label="Minimum Anonymity threshold"
            >
              <InputNumber className="w-full" min={2} />
            </Form.Item>
            <Space className="mb-12" size={12}>
              <p className="text-2xl medium">Offices</p>
              <Tooltip
                title={
                  <div>
                    If you got multiple (virtual) office locations, you can
                    select those here. This allows you in the analytic section
                    to filter based on office locations. Note: Team members have
                    to select the office they belong in their{" "}
                    <i>profile section or via Slack</i>.
                  </div>
                }
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
            <Form.List name="offices">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key}>
                      <Col span={24}>
                        <p className="mb-12 text-xl medium">
                          Location {name + 1}
                        </p>
                        <Space
                          size={24}
                          align="baseline"
                          style={{ display: "flex" }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "country_code"]}
                            fieldKey={[fieldKey, "country_code"]}
                            rules={[
                              {
                                required: true,
                                message: "Country is required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: 360 }}
                              optionFilterProp="label"
                              placeholder="Select country"
                            >
                              {countries.map((item) => {
                                const { name, code } = item;
                                return (
                                  <Select.Option
                                    key={code}
                                    value={code}
                                    label={name}
                                  >
                                    <Space>
                                      <Avatar src={item.flag} size="small" />
                                      <p>{name}</p>
                                    </Space>
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "cities"]}
                          fieldKey={[fieldKey, "cities"]}
                          rules={[
                            { required: true, message: "Cities are required" },
                          ]}
                        >
                          <Select mode="tags" placeholder="Enter cities" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      block
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add office location
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </If>
          <If condition={hasWriteAccess}>
            <Form.Item noStyle>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={saving}
                disabled={profileSaving}
              >
                Save
              </Button>
            </Form.Item>
          </If>
        </Form>
      </Col>
      <Col span={12}>
        <p className="text-2xl uppercase medium mb-16">Profile settings</p>
        <Form
          layout="vertical"
          form={profileForm}
          requiredMark={false}
          onFinish={(values) => onProfileSubmit(values)}
        >
          <Form.Item
            label="Office"
            name={["member", "office"]}
            rules={[
              { required: true, message: "Office selection is required" },
            ]}
          >
            <Select showSearch optionFilterProp="value">
              {(workspace.offices || []).map((item) => {
                return (
                  <Select.OptGroup label={item.country} key={item.country_code}>
                    {item.cities.map((city) => {
                      return (
                        <Select.Option value={city} key={city}>
                          {city}
                        </Select.Option>
                      );
                    })}
                  </Select.OptGroup>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item noStyle>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={saving}
              loading={profileSaving}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AccountHook(WorkspaceSettings);
