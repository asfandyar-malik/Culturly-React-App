import { message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { INDEX_ROUTE } from "routes";
import { AUTHORIZATION_KEY } from "../../../constants";
import { authenticateWorkspaceUsingAuth, getUserDetail } from "actions";

import AccountHook from "hooks/account";
import connectedImg from "assets/images/connected.svg";
import notConnectedImg from "assets/images/connection-error.svg";

import "../style.scss";

const WorkspaceOAuthComplete = ({ setAccountData }) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const code = params.get("code");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorStatusCode, setErrorStatusCode] = useState();

  useEffect(() => {
    if (code) {
      authenticateWorkspaceUsingAuth({ code })
        .then((response) => {
          const isNewInstalled = response.is_new_installed;
          localStorage.setItem(AUTHORIZATION_KEY, response.token);
          getUserDetail().then((userResponse) => {
            if (isNewInstalled) {
              message.success(
                "Congratulations!! Your workspace has been succesfully connected"
              );
            }
            setAccountData(userResponse);
            history.push({
              pathname: INDEX_ROUTE,
              state: {
                is_new_installed: isNewInstalled,
              },
            });
          });
        })
        .catch((err = {}) => {
          const { error } = err?.response?.data;
          setErrorStatusCode(err?.response?.status);
          setError(`Look like something went wrong, ${error}`);
          setLoading(false);
        });
    } else {
      setError("Look like something went wrong");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ) : error ? (
          <>
            <img src={notConnectedImg} alt="error" className="error-img" />
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
              <Otherwise>
                <p className="text-xl">{error}</p>
              </Otherwise>
            </Choose>
          </>
        ) : (
          <>
            <img src={connectedImg} className="success-img" alt="Success" />
            <p className="text-3xl medium">Authentication Success</p>
            <p className="text-xl">
              Congratulations, you have succesfully authenticated yourself.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountHook(WorkspaceOAuthComplete);
