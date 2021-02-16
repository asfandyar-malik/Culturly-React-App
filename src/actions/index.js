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

export const loginUserUsingOAuth = (payload) => {
  delete instance.defaults.headers.common["Authorization"];
  return new Promise((resolve, reject) => {
    instance
      .post(endpoints.COMPLETE_SLACK_USER_OAUTH_API_PATH, payload)
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
