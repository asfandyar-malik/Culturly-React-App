import instance from "../axios";
import * as endpoints from "./endpoints";
import { AUTHORIZATION_KEY } from "../constants";

export const getChannelAttachmentUploadPath = (channelId) => {
  return `${
    instance.defaults.baseURL
  }${endpoints.CHANNEL_ATTACHMENT_UPLOAD_API_PATH.replace("{}", channelId)}`;
};

export const getSlackConfiguration = () => {
  return instance.get(endpoints.SLACK_CONFIGURATION_API_PATH);
};

export const getSlackMembers = (queryString = "") => {
  const path = endpoints.SLACK_MEMBERS_BASE_API_PATH.concat("?", queryString);
  return instance.get(path);
};

export const updateSlackMember = (memberId, payload) => {
  let path = endpoints.SLACK_MEMBER_DETAIL_API_PATH;
  path = path.replace("{}", memberId);
  return instance.patch(path, payload);
};

export const bulkSetSlackMemberAdmin = (payload) => {
  return instance.post(endpoints.SLACK_BULK_SET_ADMIN_API_PATH, payload);
};

export const getAllSlackMembers = () => {
  return instance.get(endpoints.SLACK_ALL_MEMBERS_API_PATH);
};

export const getLeaderboardScore = (teamId, endTs, startTs) => {
  let path = endpoints.WORKPSACE_TEAM_LEADERBOARD_SCORE_API_PATH;
  path = path.concat("?team_id=", teamId);
  path = path.concat("&end_date=", endTs);
  path = path.concat("&start_date=", startTs);
  return instance.get(path);
};

export const getSurveys = () => {
  return instance.get(endpoints.SURVEYS_BASE_API_PATH);
};

export const getSurveyQuestionCategories = () => {
  return instance.get(endpoints.SURVEY_QUESTION_CATEGORIES_API_PATH);
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

export const updateProfile = (payload) => {
  return instance.patch(endpoints.USER_PROFILE_UPDATE_API_PATH, payload);
};

export const userLogout = () => {
  return instance.post(endpoints.USER_LOGOUT_API_PATH);
};

export const getTimezones = () => {
  return instance.get(endpoints.TIMEZONES_API_PATH);
};

export const getCountries = () => {
  return instance.get(endpoints.COUNTRIES_API_PATH);
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

export const getWorkspaceTeams = (fields) => {
  let path = endpoints.WORKSPACE_TEAMS_BASE_API_PATH;
  if (fields) {
    path = path.concat("?fields=", fields);
  }
  return instance.get(path);
};

export const getCanCreateWorkspaceTeam = () => {
  return instance.get(endpoints.CAN_CREATE_WORKSPACE_TEAM_API_PATH);
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

export const getHappinessScore = (teamId) => {
  let path = endpoints.WORKPSACE_TEAM_HAPPINESS_SCORE_API_PATH;
  path = path.concat("?team_id=", teamId);
  return instance.get(path);
};

export const getHappinessGraph = (teamId, startTs, endTs) => {
  let path = endpoints.WORKPSACE_TEAM_HAPPINESS_GRAPH_API_PATH;
  path = path.concat("?team_id=", teamId);
  path = path.concat("&end_date=", endTs);
  path = path.concat("&start_date=", startTs);
  return instance.get(path);
};

export const getCultureScore = (teamId) => {
  let path = endpoints.WORKPSACE_TEAM_CULTURE_SCORE_API_PATH;
  path = path.concat("?team_id=", teamId);
  return instance.get(path);
};

export const getCultureScorePerCategory = (teamId, startTs, endTs) => {
  let path = endpoints.WORKPSACE_TEAM_CULTURE_SCORE_PER_CATEGORY_API_PATH;
  path = path.concat("?team_id=", teamId);
  path = path.concat("&end_date=", endTs);
  path = path.concat("&start_date=", startTs);
  return instance.get(path);
};

export const getCultureGraph = (teamId, startTs, endTs, category) => {
  let path = endpoints.WORKPSACE_TEAM_CULTURE_GRAPH_API_PATH;
  path = path.concat("?team_id=", teamId);
  path = path.concat("&end_date=", endTs);
  path = path.concat("&start_date=", startTs);
  path = path.concat("&category_slug=", category);
  return instance.get(path);
};

export const getAllCultureGraph = (teamId, startTs, endTs) => {
  let path = endpoints.WORKPSACE_TEAM_CULTURE_ALL_GRAPH_API_PATH;
  path = path.concat("?team_id=", teamId);
  path = path.concat("&end_date=", endTs);
  path = path.concat("&start_date=", startTs);
  return instance.get(path);
};

export const getEventsFeedback = () => {
  return instance.get(endpoints.WORKSPACE_EVENTS_FEEDBACK_API_PATH);
};

export const getEventsPoll = () => {
  return instance.get(endpoints.WORKSPACE_EVENTS_POLL_API_PATH);
};

export const getEventRecommendations = () => {
  return instance.get(endpoints.EVENT_RECOMMENDATION_API_PATH);
};

export const getEventRecommendationSections = () => {
  return instance.get(endpoints.EVENT_RECOMMENDATION_SECTIONS_API_PATH);
};

export const getCourseRecommendationSections = () => {
  return instance.get(endpoints.COURSE_RECOMMENDATION_SECTIONS_API_PATH);
};

export const getEventRecommendationCateogries = () => {
  return instance.get(endpoints.EVENT_RECOMMENDATION_CATEGORIES_API_PATH);
};

export const getEvents = (queryString) => {
  return instance.get(
    endpoints.EVENTS_BASE_API_PATH.concat("?", queryString || "")
  );
};

export const getEventCategories = () => {
  return instance.get(endpoints.EVENT_CATEGORIES_API_PATH);
};

export const getEventDetail = (slug) => {
  return instance.get(endpoints.EVENT_DETAIL_API_PATH.replace("{}", slug));
};

export const getEventBookings = () => {
  return instance.get(endpoints.EVENT_BOOKINGS_API_PATH);
};

export const registerForEvent = (slug, payload) => {
  const path = endpoints.EVENT_REGISTER_API_PATH.replace("{}", slug);
  return instance.post(path, payload);
};

export const contactEventHost = (slug) => {
  return instance.post(
    endpoints.EVENT_CONTACT_HOST_API_PATH.replace("{}", slug)
  );
};

export const getChannels = () => {
  return instance.get(endpoints.CHANNEL_BASE_API_PATH);
};

export const getChannelMessages = (page, channelId, hostId) => {
  let path = endpoints.CHANNEL_MESSAGES_API_PATH.replace("{}", channelId);
  path = path.concat("?host_id=", hostId);
  path = path.concat("&page=", page);
  return instance.get(path);
};

export const sendChannelMessage = (channelId, hostId, payload) => {
  let path = endpoints.CHANNEL_MESSAGES_API_PATH.replace("{}", channelId);
  path = path.concat("?host_id=", hostId);
  return instance.post(path, payload);
};
