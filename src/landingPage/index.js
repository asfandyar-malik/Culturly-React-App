import { useEffect, useState } from "react";
import { getSlackConfiguration } from "../actions";

import yogaImg from "../images/yoga.png";
import guitarImg from "../images/guitar.png";
import empowerImg from "../images/empower.png";

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
      <div className="header">
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
      </div>
      <div className="body">
        <div>
          <p className="title mar-t-12">
            Company Culture Platform for Distributed teams
          </p>
          <p className="sub-title mar-b-16 mar-t-8">
            Manage your company culture seamlessly inside your workplace
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
          <div className="images-list">
            <img src={empowerImg} />
            <img src={yogaImg} />
            <img src={guitarImg} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
