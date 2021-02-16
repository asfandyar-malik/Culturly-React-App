import { useEffect, useState } from "react";
import { getSlackConfiguration } from "../actions";

import "./style.scss";

const LandingPage = () => {
  const [configuration, setConfiguration] = useState({});

  useEffect(() => {
    getSlackConfiguration().then((response) => {
      setConfiguration(response.data);
    });
  }, []);

  return (
    <div className="landing-page">
      <div>
        <a href={configuration.user_login_url}>
          <img
            alt="Sign in with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x,
                 https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
        <p className="title mar-t-12">Make it happen, where work happens</p>
        <p className="sub-title mar-b-16 mar-t-8">
          Manage your OKRs from within your workplace messaging app
        </p>
        <div>
          <a href={configuration.app_install_url}>
            <img
              height="40"
              width="139"
              alt="Add to Slack"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x,
                        https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
