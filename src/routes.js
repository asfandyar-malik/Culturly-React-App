export const INDEX_ROUTE = "/";
export const MEMBERS_ROUTE = "/members/";
export const SETTINGS_ROUTE = "/settings/";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const ROUTES = [
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
];
