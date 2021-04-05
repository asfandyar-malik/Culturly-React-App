import { Route } from "react-router-dom";

const RouteWithSubRoutes = (props) => {
  return (
    <Route
      // exact
      path={props.path}
      render={(routeProps) => (
        // pass the sub-routes down to keep nesting
        <props.component {...routeProps} routes={props.routes} />
      )}
    />
  );
};

export default RouteWithSubRoutes;
