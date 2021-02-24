import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { AUTHORIZATION_KEY } from "../../constants";
import { authenticateWorkspaceUsingAuth, getUserDetail } from "../../actions";

import AccountHook from "../../hooks/account";
import connectedImg from "../../images/connected.svg";
import notConnectedImg from "../../images/not_connected.svg";

import "../style.scss";

const WorkspaceAuthComplete = ({ setAccountData }) => {
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
          localStorage.setItem(AUTHORIZATION_KEY, response.token);
          getUserDetail().then((response) => {
            setAccountData(response);
            setLoading(false);
          });
        })
        .catch((err) => {
          const { error } = err.response.data;
          setErrorStatusCode(err.response.status);
          setError(`Look like something went wrong, ${error}`);
          setLoading(false);
        });
    } else {
      setError("Look like something went wrong");
      setLoading(false);
    }
  }, [code]);

  return (
    <div className="account-login">
      <div>
        {loading ? (
          <>
            <Spin />
            <p className="sub-title">
              Please wait while we are authenticating you
            </p>
          </>
        ) : error ? (
          <>
            <img src={notConnectedImg} className="error-img" />
            {errorStatusCode === 401 ? (
              <>
                <p className="title">Insufficient Permissions !</p>
                <p className="sub-title mar-b-8">
                  Please check if you are admin of your Slack workspace.
                </p>
                <p className="sub-title">
                  If you dont have admin priviledges, simply request your admin
                  to install the slack app. Once installed, the admin can make
                  you an admin for Culturly App, so you can view all dashboards.
                </p>
              </>
            ) : (
              <p className="sub-title">{error}</p>
            )}
          </>
        ) : (
          <>
            <img src={connectedImg} className="success-img" />
            <p className="title">Authentication Success</p>
            <p className="sub-title">
              Congratulations, you hve succesfully authenticated yourself.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountHook(WorkspaceAuthComplete);
