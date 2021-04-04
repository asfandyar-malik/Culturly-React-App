import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Spin } from "antd";

import * as routes from "./routes";
import { isEmpty } from "./_dash";
import { getUserDetail } from "./actions";
import { IndexRoute, LoggedInRoute, NonLoggedInRoute } from "./utils/appRouter";

import Settings from "./settings";
import LandingPage from "./landingPage";
import AccountHook from "./hooks/account";
import TeamManagement from "./teamManagement";
import MemberManagement from "./memberManagement";
import UserLoginAuthComplete from "./authComplete/user";
import WorkspaceAuthComplete from "./authComplete/workspace";

import EventFeedback from "./events/feedback";
import EventRequests from "./events/requests";
import EventRecommendations from "./events/recommendation";

import "./styles/App.scss";

const AppRouter = ({ accountData, setAccountData }) => {
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !isEmpty(accountData);

  useEffect(() => {
    getUserDetail()
      .then((response) => {
        setAccountData(response);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin />;
  }

  return (
    <Router>
      <Switch>
        <IndexRoute
          exact
          isLoggedIn={isLoggedIn}
          component={LandingPage}
          path={routes.INDEX_ROUTE}
        />
        <LoggedInRoute
          exact
          isLoggedIn={isLoggedIn}
          component={MemberManagement}
          path={routes.MEMBERS_ROUTE}
        />
        <NonLoggedInRoute
          exact
          isLoggedIn={isLoggedIn}
          component={UserLoginAuthComplete}
          path={routes.SLACK_OAUTH_COMPLETE_ROUTE}
        />
        <NonLoggedInRoute
          exact
          isLoggedIn={isLoggedIn}
          component={WorkspaceAuthComplete}
          path={routes.SLACK_WORKSPACE_OAUTH_COMPLETE_ROUTE}
        />
        <LoggedInRoute
          exact
          component={Settings}
          isLoggedIn={isLoggedIn}
          path={routes.SETTINGS_ROUTE}
        />
        <LoggedInRoute
          exact
          component={TeamManagement}
          isLoggedIn={isLoggedIn}
          path={routes.TEAMS_ROUTE}
        />
        <LoggedInRoute
          exact
          component={EventFeedback}
          isLoggedIn={isLoggedIn}
          path={routes.EVENT_FEEDBACK_ROUTE}
        />
        <LoggedInRoute
          exact
          component={EventRequests}
          isLoggedIn={isLoggedIn}
          path={routes.EVENT_REQUESTS_ROUTE}
        />
        <LoggedInRoute
          exact
          component={EventRecommendations}
          isLoggedIn={isLoggedIn}
          path={routes.EVENT_RECOMMENDATION_ROUTE}
        />
      </Switch>
    </Router>
  );
};

export default AccountHook(AppRouter);
