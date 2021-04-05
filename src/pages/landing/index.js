import React, { useEffect, useState } from "react";
import { Button } from "antd";
import culturlyLogo from "../../images/culturly.jpeg";
import slackLogo from "../../images/slack.png";
import teamLogo from "../../images/teams.png";
import backgroundImage from "../../images/bg.png";

import { getSlackConfiguration } from "actions";

import "./style.scss";

const LoginPage = () => {
  const [configuration, setConfiguration] = useState({});

  useEffect(() => {
    getSlackConfiguration().then((response) => {
      setConfiguration(response.data);
    });
  }, []);

  return (
    <div className="sign-in-container">
      <img src={backgroundImage} alt="" className="bg-img" />
      <div className="card-container">
        <img alt="icon" src={culturlyLogo} width="200px" />
        <div className="title-container">
          <div className="title coal">
            Company <span className="title purple ">Culture</span>
            <span className="title light-blue"> Platform</span>
            <br></br>
            for distribute teams
          </div>
        </div>
        <div className="sub-text">
          Manage your company culture seamlessly inside your workspace
        </div>
        <Button
          icon={
            <img
              className="slack-logo"
              src={slackLogo}
              alt="icon"
              width="58px"
            />
          }
          href={configuration.user_login_url}
          className="sign-in-btn light-blue-border"
        >
          Sign in with Slack
        </Button>
        <Button
          icon={
            <img className="team-logo" src={teamLogo} alt="icon" width="58px" />
          }
          className="sign-in-btn purple-border"
          href="#"
        >
          Coming Soon
        </Button>
      </div>
    </div>
  );
};
export default LoginPage;

// import { useEffect, useState } from "react";

// import { getSlackConfiguration } from "actions";

// import yogaImg from "assets/images/yoga.png";
// import guitarImg from "assets/images/guitar.png";
// import empowerImg from "assets/images/empower.png";

// import "./style.scss";

// const Landing = () => {
//   const [configuration, setConfiguration] = useState({});

//   useEffect(() => {
//     getSlackConfiguration().then((response) => {
//       setConfiguration(response.data);
//     });
//   }, []);

//   return (
//     <div className="landing-page">
//       <div className="header">
//         <a href={configuration.user_login_url}>
//           <img
//             alt="Sign in with Slack"
//             height="40"
//             width="172"
//             src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
//             srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x,
//                  https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
//           />
//         </a>
//       </div>
//       <div className="body">
//         <div>
//           <p className="text-3xl medium mt-12">
//             Company Culture Platform for Distributed teams
//           </p>
//           <p className="text-xl mb-16">
//             Manage your company culture seamlessly inside your workplace
//           </p>
//           <div>
//             <a href={configuration.app_install_url}>
//               <img
//                 height="40"
//                 width="139"
//                 alt="Add to Slack"
//                 src="https://platform.slack-edge.com/img/add_to_slack.png"
//                 srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x,
//                         https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
//               />
//             </a>
//           </div>
//           <div className="images-list">
//             <img src={empowerImg} />
//             <img src={yogaImg} />
//             <img src={guitarImg} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Landing;
