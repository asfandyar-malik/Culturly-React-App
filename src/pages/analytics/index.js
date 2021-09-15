import { Form, Select, Tabs } from "antd";
import { useEffect, useState } from "react";

import { getWorkspaceTeams } from "actions";

import CultureAnalyticsCard from "./culture";
import HappinessAnalyticsCard from "./happiness";

import "./style.scss";

const { TabPane } = Tabs;

const Analytics = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
    });
  }, []);

  return (
    <div className="analytics-container max-container">
      <Form>
        <Form.Item className="no-margin">
          <Select
            size="large"
            value={selectedTeam}
            style={{ width: 300 }}
            placeholder="Select a team"
            onChange={(value) => setSelectedTeam(value)}
          >
            <Select.Option value="">All Department</Select.Option>
            {teams.map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
      <div className="mt-20">
        <Tabs defaultActiveKey="happiness">
          <TabPane tab="Happiness" key="happiness">
            <HappinessAnalyticsCard selectedTeam={selectedTeam} />
          </TabPane>
          <TabPane tab="Culture" key="culture">
            <CultureAnalyticsCard selectedTeam={selectedTeam} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
