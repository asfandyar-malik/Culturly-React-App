import { lazy } from "react";
import {
  TeamOutlined,
  ApartmentOutlined,
  PieChartOutlined,
  SettingOutlined,
  SmileOutlined,
  AimOutlined,
  MacCommandOutlined,
} from "@ant-design/icons";

import AppLayout from "layouts/appLayout";
import RenderRoutes from "components/renderRoutes";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const INDEX_ROUTE = "/";
export const MEMBERS_ROUTE = "/members/";
export const SETTINGS_ROUTE = "/settings/";
export const ANALYTICS_ROUTE = "/analytics/";
export const EVENT_FEEDBACK_ROUTE = "/event-feedback/";
export const EVENT_REQUESTS_ROUTE = "/event-requests/";
export const EVENT_RECOMMENDATION_ROUTE = "/event-recommendation/";

const UserOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/user")
);
const WorkspaceOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/workspace")
);

const EventFeedbackComponent = lazy(() => import("pages/eventFeedback"));
const EventRequestsComponent = lazy(() => import("pages/eventRequests"));
const EventRecommendationComponent = lazy(() =>
  import("pages/eventRecommendation")
);

const LandingComponent = lazy(() => import("pages/landing"));
const AnalyticsComponent = lazy(() => import("pages/analytics"));
const WorkspaceSettingsComponent = lazy(() => import("pages/settings"));
const TeamManagementComponent = lazy(() => import("pages/teamManagement"));
const MemberManagementComponent = lazy(() => import("pages/memberManagement"));

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
        name: "event-requests",
        path: EVENT_REQUESTS_ROUTE,
        component: EventRequestsComponent,
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
    key: "event-feedback",
    title: "Event feedback",
    icon: <SmileOutlined />,
    path: EVENT_FEEDBACK_ROUTE,
  },
  {
    key: "event-requests",
    title: "Event requests",
    icon: <AimOutlined />,
    path: EVENT_REQUESTS_ROUTE,
  },
];
