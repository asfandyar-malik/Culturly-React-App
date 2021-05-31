import { Spin } from "antd";
import { Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import NotFoundPage from "pages/404Page";
import RouteWithSubRoutes from "../routeWithSubRoutes";

const RenderRoutes = ({ routes }) => {
  return (
    <Suspense
      fallback={
        <div className="h-full vertical-center">
          <Spin />
        </div>
      }
    >
      <Switch>
        {routes.map((route, i) => {
          return <RouteWithSubRoutes key={route.name} {...route} />;
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};

export default RenderRoutes;
