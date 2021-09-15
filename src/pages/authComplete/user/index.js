import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { isEmpty } from "_dash";
import { INDEX_ROUTE } from "routes";
import { AUTHORIZATION_KEY } from "../../../constants";
import { authenticateUserUsingAuth, getUserDetail } from "actions";

import AccountHook from "hooks/account";
import connectedImg from "assets/images/connected.svg";
import notConnectedImg from "assets/images/connection-error.svg";

import "../style.scss";

const UserOAuthComplete = ({ setAccountData }) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const code = params.get("code");

  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({});
  const [errorStatusCode, setErrorStatusCode] = useState();

  useEffect(() => {
    if (code) {
      authenticateUserUsingAuth({ code })
        .then((response) => {
          localStorage.setItem(AUTHORIZATION_KEY, response.token);
          getUserDetail().then((response) => {
            setAccountData(response);
            history.push(INDEX_ROUTE);
          });
        })
        .catch((err) => {
          const { response } = err;
          setErrorData(response?.data);
          setErrorStatusCode(response?.status);
          setLoading(false);
        });
    } else {
      setErrorData({ error: "" });
      setLoading(false);
    }
  }, [code]);

  return (
    <div className="account-login">
      <div>
        {loading ? (
          <>
            <Spin />
            <p className="text-xl">
              Please wait while we are authenticating you
            </p>
          </>
        ) : !isEmpty(errorData) ? (
          <>
            <img src={notConnectedImg} className="error-img" alt="error" />
            <Choose>
              <When condition={errorStatusCode === 401}>
                <p className="text-3xl medium">Insufficient Permissions !</p>
                <p className="text-xl mb-8">
                  Please check if you are admin of your Slack workspace.
                </p>
                <p className="text-xl">
                  If you dont have admin priviledges, simply request your admin
                  to install the slack app. Once installed, the admin can make
                  you an admin for Culturly App, so you can view all dashboards.
                </p>
              </When>
              <When condition={errorStatusCode === 404}>
                <p className="text-3xl mb-12 medium">
                  This slack workspace is not connected with culturly App. you
                  can add it by clicking on
                </p>
                <Button
                  type="primary"
                  onClick={() => window.open(errorData.authorize_url, "_self")}
                >
                  Add to workspace
                </Button>
              </When>
              <Otherwise>
                <p className="text-xl">
                  Look like something went wrong {errorData.error}
                </p>
              </Otherwise>
            </Choose>
          </>
        ) : (
          <>
            <img src={connectedImg} className="success-img" alt="success" />
            <p className="text-3xl medium">Authentication Success</p>
            <p className="text-xl">
              Congratulations, you hve succesfully authenticated yourself.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountHook(UserOAuthComplete);
