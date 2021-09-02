import { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Spin } from "antd";

import { isEmpty } from "./_dash";
import { getUserDetail } from "./actions";
import { LOGGED_IN_ROUTES, NON_LOGIN_ROUTES } from "routes";

import AccountHook from "./hooks/account";
import RouteWithSubRoutes from "components/routeWithSubRoutes";

import "./styles/style.scss";

const AppRouter = ({ accountData, setAccountData }) => {
  const { member = {} } = accountData;

  const [loading, setLoading] = useState(true);
  const [currentRoutes, setCurrentRoutes] = useState([]);

  useEffect(() => {
    getUserDetail()
      .then((response) => {
        setAccountData(response);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newRoutes = [];
    if (!loading) {
      if (!isEmpty(accountData)) {
        // TODO: refactor this make more scalable
        newRoutes = LOGGED_IN_ROUTES;
        // let childRoutes = LOGGED_IN_ROUTES[0].routes;
        // if (member.is_admin) {
        //   childRoutes = childRoutes.filter((item) =>
        //     item.roles.includes("admin")
        //   );
        // } else if (member.is_manager) {
        //   childRoutes = childRoutes.filter((item) =>
        //     item.roles.includes("manager")
        //   );
        // } else {
        //   childRoutes = childRoutes.filter((item) =>
        //     item.roles.includes("member")
        //   );
        // }
        // newRoutes = [
        //   {
        //     ...LOGGED_IN_ROUTES[0],
        //     routes: childRoutes,
        //   },
        // ];
      } else {
        newRoutes = NON_LOGIN_ROUTES;
      }
      setCurrentRoutes(newRoutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData, loading]);

  if (loading) {
    return (
      <div className="h-full vertical-center">
        <Spin />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Switch>
        {currentRoutes.map((route, i) => {
          return <RouteWithSubRoutes key={i} {...route} />;
        })}
      </Switch>
    </BrowserRouter>
  );
};

export default AccountHook(AppRouter);
