import { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { Spin } from "antd";

import * as routes from "routes";
import { isEmpty } from "./_dash";
import { getUserDetail } from "./actions";

import AccountHook from "./hooks/account";
import RouteWithSubRoutes from "components/routeWithSubRoutes";

import "./styles/style.scss";

const AppRouter = ({ accountData, setAccountData }) => {
  const isLoggedIn = !isEmpty(accountData);

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
  }, []);

  useEffect(() => {
    let newRoutes = [];
    if (!loading) {
      if (isLoggedIn) {
        newRoutes = routes.LOGGED_IN_ROUTES;
      } else {
        newRoutes = routes.NON_LOGIN_ROUTES;
      }
      setCurrentRoutes(newRoutes);
    }
  }, [isLoggedIn, loading]);

  if (loading) {
    return (
      <div className="vertical-center">
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
