import { Spin } from "antd";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { INDEX_ROUTE } from "../routes";
import { AUTHORIZATION_KEY } from "../constants";
import { loginUserUsingOAuth, getUserDetail } from "../actions";

import AccountHook from "../hooks/account";

const UserLoginAuthComplete = ({ setAccountData }) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const code = params.get("code");
  useEffect(() => {
    if (code) {
      loginUserUsingOAuth({ code }).then((response) => {
        localStorage.setItem(AUTHORIZATION_KEY, response.token);
        getUserDetail().then((response) => {
          setAccountData(response);
        });
      });
    }
  }, [code]);

  return (
    <div>
      <Spin />
      <p>Please wait while we are authorizing you with app</p>
    </div>
  );
};

export default AccountHook(UserLoginAuthComplete);
