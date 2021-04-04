import instance from "../axios";
import * as endpoints from "./endpoints";
import { AUTHORIZATION_KEY } from "../constants";

export const getSlackConfiguration = () => {
  return instance.get(endpoints.SLACK_CONFIGURATION_API_PATH);
};

export const getSlackMembers = () => {
  return instance.get(endpoints.SLACK_MEMBERS_BASE_API_PATH);
};

export const updateSlackMember = (memberId, payload) => {
  let path = endpoints.SLACK_MEMBER_DETAIL_API_PATH;
  path = path.replace("{}", memberId);
  return instance.patch(path, payload);
};

export const getSurveys = () => {
  return instance.get(endpoints.SURVEYS_BASE_API_PATH);
};

export const updateSurveyForWorkspace = (payload, objectId = null) => {
  let path = null;
  let method = null;
  if (objectId) {
    path = endpoints.WORKSPACE_SURVEY_DETAIL_API_PATH;
    path = path.replace("{}", objectId);
    method = "PATCH";
  } else {
    method = "POST";
    path = endpoints.WORKSPACE_SURVEY_BASE_API_PATH;
  }
  return instance.request({
    method: method,
    url: path,
    data: payload,
  });
};

export const authenticateWorkspaceUsingAuth = (payload) => {
  delete instance.defaults.headers.common["Authorization"];
  return new Promise((resolve, reject) => {
    instance
      .post(endpoints.WORKSPACE_AUTH_API_PATH, payload)
      .then((response) => {
        const { data } = response;
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const authenticateUserUsingAuth = (payload) => {
  delete instance.defaults.headers.common["Authorization"];
  return new Promise((resolve, reject) => {
    instance
      .post(endpoints.USER_AUTH_API_PATH, payload)
      .then((response) => {
        const { data } = response;
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem(AUTHORIZATION_KEY);
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      instance
        .get(endpoints.USER_DETAIL_API_PATH)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      reject();
    }
  });
};

export const userLogout = () => {
  return instance.post(endpoints.USER_LOGOUT_API_PATH);
};

export const getTimezones = () => {
  return instance.get(endpoints.TIMEZONES_API_PATH);
};

export const updateWorkspace = (workspaceId, payload) => {
  let path = endpoints.SLACK_WORKSPACE_UPDATE_API_PATH;
  return instance.patch(path.replace("{}", workspaceId), payload);
};

export const getWorkspaceRemainingTeamMembers = () => {
  return instance.get(endpoints.WORKSPACE_REMAINING_TEAM_MEMBERS_API_PATH);
};

export const getWorkspaceRemainingTeamManagers = () => {
  return instance.get(endpoints.WORKSPACE_REMAINING_TEAM_MANAGERS_API_PATH);
};

export const getWorkspaceTeams = () => {
  return instance.get(endpoints.WORKSPACE_TEAMS_BASE_API_PATH);
};

export const createWorkspaceTeam = (payload) => {
  return instance.post(endpoints.WORKSPACE_TEAMS_BASE_API_PATH, payload);
};

export const updateWorkspaceTeam = (teamId, payload) => {
  let path = endpoints.WORKSPACE_TEAM_UPDATE_API_PATH.replace("{}", teamId);
  return instance.patch(path, payload);
};

export const deleteWorkspaceTeam = (teamId) => {
  let path = endpoints.WORKSPACE_TEAM_UPDATE_API_PATH.replace("{}", teamId);
  return instance.delete(path);
};

export const getEventFeedback = () => {
  return instance.get(endpoints.WORKSPACE_EVENT_FEEDBACK_API_PATH);
};

export const getEventRequests = () => {
  return instance.get(endpoints.WORKSPACE_EVENT_REQUESTS_API_PATH);
};

export const getEventRecommendations = () => {
  return instance.get(endpoints.EVENT_RECOMMENDATION_API_PATH);
};
