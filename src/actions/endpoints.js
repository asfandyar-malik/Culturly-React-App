export const TIMEZONES_API_PATH = "timezones/";
export const COUNTRIES_API_PATH = "countries/";

// USER API's

export const USER_DETAIL_API_PATH = "user/";
export const USER_LOGOUT_API_PATH = "logout/";
export const USER_PROFILE_UPDATE_API_PATH = `${USER_DETAIL_API_PATH}update_profile/`;

// USER AUTH API's

export const USER_AUTH_API_PATH = "auth-user/complete/";
export const WORKSPACE_AUTH_API_PATH = "auth-workspace/complete/";

// Slack API's

export const SLACK_BOT_BASE_API_PATH = "slack_bot/";

export const SLACK_WORKSPACE_UPDATE_API_PATH = `${SLACK_BOT_BASE_API_PATH}workspace/{}/`;

export const SURVEYS_BASE_API_PATH = "slack_bot/surveys/";
export const SLACK_MEMBERS_BASE_API_PATH = "slack_bot/members/";
export const SLACK_CONFIGURATION_API_PATH = "slack_bot/configuration/";
export const SLACK_MEMBER_DETAIL_API_PATH = `${SLACK_MEMBERS_BASE_API_PATH}{}/`;
export const SLACK_ALL_MEMBERS_API_PATH = `${SLACK_MEMBERS_BASE_API_PATH}all_members/`;
export const SLACK_BULK_SET_ADMIN_API_PATH = `${SLACK_MEMBERS_BASE_API_PATH}bulk_set_admins/`;
export const WORKSPACE_TEAMS_BASE_API_PATH = "slack_bot/teams/";
export const WORKSPACE_TEAM_UPDATE_API_PATH = "slack_bot/teams/{}/";
export const CAN_CREATE_WORKSPACE_TEAM_API_PATH = "slack_bot/teams/can_create_team/";
export const WORKPSACE_TEAM_LEADERBOARD_SCORE_API_PATH =
  "slack_bot/teams/leaderboard_score/";
export const WORKPSACE_TEAM_HAPPINESS_SCORE_API_PATH =
  "slack_bot/teams/happiness_score/";
export const WORKPSACE_TEAM_HAPPINESS_GRAPH_API_PATH =
  "slack_bot/teams/happiness_graph/";
export const WORKPSACE_TEAM_CULTURE_SCORE_PER_CATEGORY_API_PATH =
  "slack_bot/teams/culture_score_per_category/";
export const WORKPSACE_TEAM_CULTURE_SCORE_API_PATH =
  "slack_bot/teams/culture_score/";
export const WORKPSACE_TEAM_CULTURE_GRAPH_API_PATH =
  "slack_bot/teams/culture_graph/";
export const WORKPSACE_TEAM_CULTURE_ALL_GRAPH_API_PATH =
  "slack_bot/teams/culture_all_graph/";
export const WORKSPACE_REMAINING_TEAM_MEMBERS_API_PATH =
  "slack_bot/members/remaining_team_members";
export const WORKSPACE_REMAINING_TEAM_MANAGERS_API_PATH =
  "slack_bot/members/remaining_team_managers";
export const WORKSPACE_EVENTS_POLL_API_PATH = "slack_bot/event-poll";
export const WORKSPACE_EVENTS_FEEDBACK_API_PATH = "slack_bot/event-feedback";
export const EVENT_RECOMMENDATION_API_PATH = "slack_bot/event-recommendation";
export const EVENT_RECOMMENDATION_SECTIONS_API_PATH =
  "slack_bot/event-recommendation-sections";
export const COURSE_RECOMMENDATION_SECTIONS_API_PATH =
  "slack_bot/course-recommendation-sections";
export const EVENT_RECOMMENDATION_CATEGORIES_API_PATH =
  "slack_bot/event-recommendation-categories";
export const SURVEY_QUESTION_CATEGORIES_API_PATH =
  "slack_bot/survey-categories/";

export const EVENTS_BASE_API_PATH = "events/";
export const EVENT_DETAIL_API_PATH = `${EVENTS_BASE_API_PATH}{}/`;
export const EVENT_REGISTER_API_PATH = `${EVENTS_BASE_API_PATH}{}/register/`;
export const USER_BOOKINGS_API_PATH = `${EVENTS_BASE_API_PATH}user-bookings/`;

export const CHANNEL_BASE_API_PATH = "channels/";
export const CHANNEL_DETAIL_API_PATH = `${CHANNEL_BASE_API_PATH}{}/`;
export const CHANNEL_MESSAGES_API_PATH = `${CHANNEL_DETAIL_API_PATH}messages/`;
export const CHANNEL_ATTACHMENT_UPLOAD_API_PATH = `${CHANNEL_DETAIL_API_PATH}upload_attachment/`;
