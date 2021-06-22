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
import EventLayout from "layouts/eventLayout";
import RenderRoutes from "components/renderRoutes";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const INDEX_ROUTE = "/";
export const EVENTS_ROUTE = "/events/";
export const MEMBERS_ROUTE = "/members/";
export const SETTINGS_ROUTE = "/settings/";
export const ANALYTICS_ROUTE = "/analytics/";
export const EVENT_POLL_ROUTE = "/event-poll/";
export const EVENT_FEEDBACK_ROUTE = "/event-feedback/";
export const EVENT_DETAIL_ROUTE = "/events/:eventSlug/";
export const EVENT_REQUESTS_ROUTE = "/event-requests/";
export const EVENT_RECOMMENDATION_ROUTE = "/event-recommendation/";

const UserOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/user")
);
const WorkspaceOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/workspace")
);

const EventsComponent = lazy(() => import("pages/events"));
const EventDetailComponent = lazy(() => import("pages/events/detail"));
const EventPollComponent = lazy(() => import("pages/eventPoll"));
const EventFeedbackComponent = lazy(() => import("pages/eventFeedback"));
const EventRecommendationComponent = lazy(() =>
  import("pages/eventRecommendation")
);

const LandingComponent = lazy(() => import("pages/landing"));
const AnalyticsComponent = lazy(() => import("pages/analytics"));
const WorkspaceSettingsComponent = lazy(() => import("pages/settings"));
const TeamManagementComponent = lazy(() => import("pages/teamManagement"));
const MemberManagementComponent = lazy(() => import("pages/memberManagement"));

export const getEventDetailRoute = (eventSlug) => {
  return EVENT_DETAIL_ROUTE.replace(":eventSlug", eventSlug);
};

export const NON_LOGIN_ROUTES = [
  {
    path: "/",
    component: RenderRoutes,
    routes: [
      {
        path: "/events/",
        name: "event-layout",
        component: EventLayout,
        routes: [
          {
            exact: true,
            name: "events",
            path: EVENTS_ROUTE,
            component: EventsComponent,
          },
          {
            exact: true,
            name: "event-detail",
            path: EVENT_DETAIL_ROUTE,
            component: EventDetailComponent,
          },
        ],
      },
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
    name: "routes",
    component: RenderRoutes,
    routes: [
      {
        path: "/events/",
        name: "event-layout",
        component: EventLayout,
        routes: [
          {
            exact: true,
            name: "events",
            path: EVENTS_ROUTE,
            component: EventsComponent,
          },
          {
            exact: true,
            name: "event-detail",
            path: EVENT_DETAIL_ROUTE,
            component: EventDetailComponent,
          },
        ],
      },
      {
        path: "/",
        name: "layout",
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
            name: "event-poll",
            path: EVENT_POLL_ROUTE,
            component: EventPollComponent,
          },
        ],
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
    key: "event-poll",
    title: "Event poll",
    icon: <ExperimentOutlined />,
    path: EVENT_POLL_ROUTE,
  },
];
