import { lazy } from "react";
import {
  TeamOutlined,
  ApartmentOutlined,
  PieChartOutlined,
  SmileOutlined,
  ExperimentOutlined,
  MacCommandOutlined,
} from "@ant-design/icons";

import AppLayout from "layouts/appLayout";
import RenderRoutes from "components/renderRoutes";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const INDEX_ROUTE = "/";
export const MEMBERS_ROUTE = "/members/";
export const LEADERBOARD_ROUTE = "/leaderboard/";
export const SETTINGS_ROUTE = "/settings/";
export const ANALYTICS_ROUTE = "/analytics/";
export const EVENT_POLL_ROUTE = "/event-poll/";
export const EVENT_FEEDBACK_ROUTE = "/event-feedback/";
export const EVENT_REQUESTS_ROUTE = "/event-requests/";
export const EVENT_RECOMMENDATION_ROUTE = "/event-recommendation/";
export const COURSE_ROUTE = "/course/";
export const SENTIMENT_ROUTE = "/sentiment-score/";

const UserOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/user")
);
const WorkspaceOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/workspace")
);

const EventPollComponent = lazy(() => import("pages/eventPoll"));
const EventFeedbackComponent = lazy(() => import("pages/eventFeedback"));
const EventRequestsComponent = lazy(() => import("pages/eventRequests"));
const EventRecommendationComponent = lazy(() => import("pages/eventRecommendation"));
const CourseRecommendationComponent = lazy(() => import("pages/courseRecommendation"));
const LandingComponent = lazy(() => import("pages/landing"));
const AnalyticsComponent = lazy(() => import("pages/analytics"));
const WorkspaceSettingsComponent = lazy(() => import("pages/settings"));
const TeamManagementComponent = lazy(() => import("pages/teamManagement"));
const MemberManagementComponent = lazy(() => import("pages/memberManagement"));
const LeaderboardComponent = lazy(() => import("pages/leaderboard"));
const SentimentComponent = lazy(() => import("pages/sentiment"));


export const NON_LOGIN_ROUTES = [
  {
    path: "/",
    component: RenderRoutes,
    routes: [
      {
        exact: true,
        name: "index",
        path: INDEX_ROUTE,
        component: LandingComponent,
      },
      {
        exact: true,
        name: "slack-user-oath",
        path: SLACK_OAUTH_COMPLETE_ROUTE,
        component: UserOAuthCompleteComponent,
      },
      {
        exact: true,
        name: "slack-workspace-oath",
        path: SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE,
        component: WorkspaceOAuthCompleteComponent,
      },
    ],
  },
];

export const LOGGED_IN_ROUTES = [
  {
    path: "/",
    component: AppLayout,
    routes: [
      {
        exact: true,
        name: "index",
        path: INDEX_ROUTE,
        component: TeamManagementComponent,
      },
      {
        exact: true,
        name: "members",
        path: MEMBERS_ROUTE,
        component: MemberManagementComponent,
      },
      {
        exact: true,
        name: "leaderboard",
        path: LEADERBOARD_ROUTE,
        component: LeaderboardComponent,
      },
      {
        exact: true,
        name: "leaderboard",
        path: SENTIMENT_ROUTE,
        component: SentimentComponent,
      },
      {
        exact: true,
        name: "settings",
        path: SETTINGS_ROUTE,
        component: WorkspaceSettingsComponent,
      },
      {
        exact: true,
        name: "analytics",
        path: ANALYTICS_ROUTE,
        component: AnalyticsComponent,
      },
      {
        exact: true,
        name: "event-feedback",
        path: EVENT_FEEDBACK_ROUTE,
        component: EventFeedbackComponent,
      },
      {
        exact: true,
        name: "event-recommendation",
        path: EVENT_RECOMMENDATION_ROUTE,
        component: EventRecommendationComponent,
      },
      {
        exact: true,
        name: "course",
        path: COURSE_ROUTE,
        component: CourseRecommendationComponent,
      },
      {
        exact: true,
        name: "event-poll",
        path: EVENT_POLL_ROUTE,
        component: EventPollComponent,
      },
    ],
  },
];

export const ROUTES = [
  {
    key: "teams",
    title: "Teams",
    icon: <TeamOutlined />,
    path: INDEX_ROUTE,
  },
  {
    key: "leaderboard",
    path: LEADERBOARD_ROUTE,
    icon: <ApartmentOutlined />,
    title: "Leaderboard",
  },
  {
    key: "members",
    path: MEMBERS_ROUTE,
    icon: <ApartmentOutlined />,
    title: "Management",
  },
  {
    key: "analytics",
    title: "Analytics",
    icon: <PieChartOutlined />,
    path: ANALYTICS_ROUTE,
  },
  {
    key: "online-events",
    title: "Online Events",
    icon: <MacCommandOutlined />,
    path: EVENT_RECOMMENDATION_ROUTE,
  },
  {
    key: "courses",
    title: "Courses",
    icon: <MacCommandOutlined />,
    path: COURSE_ROUTE,
  },
  {
    key: "sentiment",
    title: "Sentiment",
    icon: <ExperimentOutlined />,
    path: SENTIMENT_ROUTE,
  },
  {
    key: "event-feedback",
    title: "Event feedback",
    icon: <SmileOutlined />,
    path: EVENT_FEEDBACK_ROUTE,
  },
  {
    key: "event-poll",
    title: "Event poll",
    icon: <MacCommandOutlined />,
    path: EVENT_POLL_ROUTE,
  },  
];
