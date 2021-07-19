import moment from "moment";
  import { useEffect, useState } from "react";
  import {
    Select,
    DatePicker
  } from "antd";

import { getWorkspaceTeams } from "actions";

import "./style.scss";
import Leader from "./leader";

import {
  disabledFutureDate,
} from "utils";

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [leaderboardMonth, setLeaderboardMonth] = useState(moment());
  
  useEffect(() => {
    getWorkspaceTeams("name,id").then((response) => {
      setTeams(response.data.results);
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

      <DatePicker
        format="MMM"
        picker="month"
        allowClear={false}
        style={{ margin: 10, width: 200 }}
        value={leaderboardMonth}
        disabledDate={disabledFutureDate}
        onChange={(value) => setLeaderboardMonth(value)}
      />

      <Leader
        selectedTeam={selectedTeam} 
        leaderboardMonth={leaderboardMonth} 
      />
    </div>
  );
};

export default Leaderboard;