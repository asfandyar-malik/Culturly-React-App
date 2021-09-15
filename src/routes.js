import { lazy } from "react";
import {
  TeamOutlined,
  SmileOutlined,
  ControlOutlined,
  PieChartOutlined,
  ApartmentOutlined,
  ExperimentOutlined,
  MacCommandOutlined,
  MessageOutlined,
  PlaySquareOutlined,
} from "@ant-design/icons";

import AppLayout from "layouts/appLayout";
import EventLayout from "layouts/eventLayout";
import RenderRoutes from "components/renderRoutes";

export const SLACK_OAUTH_COMPLETE_ROUTE = "/auth-user/complete/";
export const SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE = "/auth-workspace/complete/";

export const INDEX_ROUTE = "/";
export const EVENTS_ROUTE = "/events/";
export const MEMBERS_ROUTE = "/members/";
export const LEADERBOARD_ROUTE = "/leaderboard/";
export const SETTINGS_ROUTE = "/settings/";
export const MESSAGING_ROUTE = "/messaging/";
export const ANALYTICS_ROUTE = "/analytics/";
export const EVENT_POLL_ROUTE = "/event-poll/";
export const EVENT_FEEDBACK_ROUTE = "/event-feedback/";
export const EVENT_DETAIL_ROUTE = "/events/:eventSlug/";
export const EVENTS_REQUESTS_ROUTE = "/events-requests/";
export const EVENT_RECOMMENDATION_ROUTE = "/event-recommendation/";
export const COURSE_ROUTE = "/course/";
export const SENTIMENT_ROUTE = "/sentiment-score/";

const UserOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/user")
);
const WorkspaceOAuthCompleteComponent = lazy(() =>
  import("pages/authComplete/workspace")
);

const EventsComponent = lazy(() => import("pages/events"));
const EventPollComponent = lazy(() => import("pages/eventPoll"));
const EventDetailComponent = lazy(() => import("pages/events/detail"));
const EventFeedbackComponent = lazy(() => import("pages/eventFeedback"));
const EventsRequestsComponent = lazy(() => import("pages/eventsRequests"));
const EventRecommendationComponent = lazy(() =>
  import("pages/eventRecommendation")
);
const CourseRecommendationComponent = lazy(() =>
  import("pages/courseRecommendation")
);
const LandingComponent = lazy(() => import("pages/landing"));
const MessagingComponent = lazy(() => import("pages/messaging"));
const AnalyticsComponent = lazy(() => import("pages/analytics"));
const WorkspaceSettingsComponent = lazy(() => import("pages/settings"));
const TeamManagementComponent = lazy(() => import("pages/teamManagement"));
const MemberManagementComponent = lazy(() => import("pages/memberManagement"));
const LeaderboardComponent = lazy(() => import("pages/leaderboard"));
const SentimentComponent = lazy(() => import("pages/sentiment"));

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
        roles: ["admin", "manager", "member"],
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
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "members",
            path: MEMBERS_ROUTE,
            component: MemberManagementComponent,
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "leaderboard",
            path: LEADERBOARD_ROUTE,
            component: LeaderboardComponent,
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "sentiment",
            path: SENTIMENT_ROUTE,
            component: SentimentComponent,
            roles: ["admin"],
          },
          {
            exact: true,
            name: "settings",
            path: SETTINGS_ROUTE,
            component: WorkspaceSettingsComponent,
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "analytics",
            path: ANALYTICS_ROUTE,
            component: AnalyticsComponent,
            roles: ["admin", "manager"],
          },
          {
            exact: true,
            name: "event-feedback",
            path: EVENT_FEEDBACK_ROUTE,
            component: EventFeedbackComponent,
            roles: ["admin", "manager"],
          },
          {
            exact: true,
            name: "event-recommendation",
            path: EVENT_RECOMMENDATION_ROUTE,
            component: EventRecommendationComponent,
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "courses",
            path: COURSE_ROUTE,
            component: CourseRecommendationComponent,
            roles: ["admin", "manager", "member"],
          },
          {
            exact: true,
            name: "event-poll",
            path: EVENT_POLL_ROUTE,
            component: EventPollComponent,
            roles: ["admin", "manager"],
          },
          {
            exact: true,
            name: "event-requests",
            path: EVENTS_REQUESTS_ROUTE,
            component: EventsRequestsComponent,
            roles: ["admin", "manager", "member"],
          },
          // {
          //   exact: true,
          //   name: "messaging",
          //   path: MESSAGING_ROUTE,
          //   component: MessagingComponent,
          //   roles: ["admin", "manager", "member"],
          // },
        ],
      },
    ],
  },
];

export const ROUTES = [
  {
    key: "teams",
    title: "Teams",
    path: INDEX_ROUTE,
    icon: <TeamOutlined />,
    roles: ["admin", "manager", "member"],
  },
  {
    key: "leaderboard",
    title: "Leaderboard",
    path: LEADERBOARD_ROUTE,
    icon: <ApartmentOutlined />,
    is_leaderboard_enabled: true,
    roles: ["admin", "manager", "member"],
  },
  {
    isHidden: true,
    key: "members",
    title: "Management",
    path: MEMBERS_ROUTE,
    icon: <ControlOutlined />,
    roles: ["admin", "manager", "member"],
  },
  {
    key: "analytics",
    title: "Analytics",
    path: ANALYTICS_ROUTE,
    icon: <PieChartOutlined />,
    roles: ["admin", "manager"],
  },
  {
    key: "online-events",
    title: "Online Events",
    icon: <PlaySquareOutlined />,
    path: EVENT_RECOMMENDATION_ROUTE,
    roles: ["admin", "manager", "member"],
  },
  {
    key: "courses",
    title: "Courses",
    path: COURSE_ROUTE,
    icon: <MacCommandOutlined />,
    roles: ["admin", "manager", "member"],
  },
  {
    isHidden: true,
    key: "sentiment",
    title: "Sentiment",
    path: SENTIMENT_ROUTE,
    icon: <ExperimentOutlined />,
    roles: ["admin"],
  },
  {
    isHidden: true,
    key: "events-requests",
    title: "Events requests",
    icon: <MessageOutlined />,
    path: EVENTS_REQUESTS_ROUTE,
    roles: ["admin", "manager", "member"],
  },
  // {
  //   key: "messages",
  //   title: "Messages",
  //   path: MESSAGING_ROUTE,
  //   icon: <MessageOutlined />,
  //   roles: ["admin", "manager", "member"],
  // },
  {
    isHidden: true,
    key: "event-feedback",
    title: "Event feedback",
    icon: <SmileOutlined />,
    path: EVENT_FEEDBACK_ROUTE,
    roles: ["admin", "manager"],
  },
  {
    isHidden: true,
    key: "event-poll",
    title: "Event poll",
    path: EVENT_POLL_ROUTE,
    icon: <MacCommandOutlined />,
    roles: ["admin", "manager"],
  },
  {
    isHidden: true,
    key: "settings",
    title: "Settings",
    path: SETTINGS_ROUTE,
    roles: ["admin", "manager", "member"],
  },
];
