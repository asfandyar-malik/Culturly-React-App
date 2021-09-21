import { useEffect, useState } from "react";
import { Space, Button, Avatar } from "antd";

import { isEmpty } from "_dash";
import { getSlackConfiguration } from "actions";

import AccountHook from "hooks/account";

import culturlyLogo from "assets/images/logo.svg";
import RenderRoutes from "components/renderRoutes";

import "./style.scss";

const EventLayout = ({ routes, accountData }) => {
  const isLoggedIn = !isEmpty(accountData);
  const [userLoginUrl, setUserLoginUrl] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      getSlackConfiguration().then((response) => {
        setUserLoginUrl(response.data.user_login_url);
      });
    }
  }, [isLoggedIn]);

  return (
    <div className="user-event-management">
      <Space className="header w-full">
        <div>
          <Space>
            <img src={culturlyLogo} alt="Logo" />
          </Space>
        </div>
        <div className="extra">
          <Space size={32}>
            <Choose>
              <When condition={isLoggedIn}>
                <Space>
                  <Avatar size="large" src={accountData.profile_pic} />
                  <div>
                    <p className="text-xl bold">{accountData.name}</p>
                    <p className="text-base secondary">
                      {accountData.workspace.name}
                    </p>
                  </div>
                </Space>
              </When>
              <Otherwise>
                <Button
                  type="primary"
                  onClick={() => window.open(userLoginUrl, "_self")}
                >
                  Sign in
                </Button>
              </Otherwise>
            </Choose>
          </Space>
        </div>
      </Space>
      <div className="content">
        <RenderRoutes routes={routes} />
      </div>
    </div>
  );
};

export default AccountHook(EventLayout);
