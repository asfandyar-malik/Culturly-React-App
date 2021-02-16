import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Spin } from "antd";

import * as routes from "./routes";
import { isEmpty } from "./_dash";
import { getUserDetail } from "./actions";
import { IndexRoute, LoggedInRoute, NonLoggedInRoute } from "./utils/appRouter";

import LandingPage from "./landingPage";
import AccountHook from "./hooks/account";
import UserLoginAuthComplete from "./login";
import MemberManagement from "./memberManagement";

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
        {/* <Route component={NotFound} /> */}
      </Switch>
    </Router>
  );
};

export default AccountHook(AppRouter);
