import { useEffect, useState } from "react";
import { Select } from "antd";

import { getWorkspaceTeams, getSurveyQuestionCategories } from "actions";

import CultureAnalyticsCard from "./culture";
import HappinessAnalyticsCard from "./happiness";

import "./style.scss";

const Analytics = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
    });
    getSurveyQuestionCategories().then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <div className="analytics-container max-container">
      <Select
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
      <HappinessAnalyticsCard selectedTeam={selectedTeam} />
      <CultureAnalyticsCard
        categories={categories}
        selectedTeam={selectedTeam}
      />
    </div>
  );
};

export default Analytics;
