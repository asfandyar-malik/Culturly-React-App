import { Redirect, Route } from "react-router-dom";
import * as routes from "../routes";

import AppLayout from "../components/appLayout";
import SurveyManagement from "../surveyManagement";

export const NonLoggedInRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (rest.isLoggedIn) {
          return <Redirect to={routes.INDEX_ROUTE} />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export const IndexRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (rest.isLoggedIn) {
          return (
            <AppLayout>
              <SurveyManagement {...props} />
            </AppLayout>
          );
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export const LoggedInRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (rest.isLoggedIn) {
          return (
            <AppLayout>
              <Component {...props} />
            </AppLayout>
          );
        } else {
          return <Redirect to={routes.INDEX_ROUTE} />;
        }
      }}
    />
  );
};
