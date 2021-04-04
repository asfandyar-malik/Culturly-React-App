export const INDEX_ROUTE = "/";
export const TEAMS_ROUTE = "/teams/";
export const MEMBERS_ROUTE = "/members/";
export const SETTINGS_ROUTE = "/settings/";
export const EVENT_FEEDBACK_ROUTE = "/event-feedback/";
export const EVENT_REQUESTS_ROUTE = "/event-requests/";
export const EVENT_RECOMMENDATION_ROUTE = "/event-recommendation/";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const ROUTES = [
  {
    key: "teams",
    title: "Teams",
    path: TEAMS_ROUTE,
  },
  {
    key: "dashboard",
    path: INDEX_ROUTE,
    title: "Dashboard",
  },
  {
    key: "members",
    path: MEMBERS_ROUTE,
    title: "Members management",
  },
  {
    key: "settings",
    path: SETTINGS_ROUTE,
    title: "Settings",
  },
  {
    key: "event-feedback",
    path: EVENT_FEEDBACK_ROUTE,
    title: "Event feedback",
  },
  {
    key: "event-requests",
    path: EVENT_REQUESTS_ROUTE,
    title: "Event requests",
  },
  {
    key: "event-recommendation",
    path: EVENT_RECOMMENDATION_ROUTE,
    title: "Event recommendation",
  },
];
