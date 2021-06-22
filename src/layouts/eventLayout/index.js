import { Space, Button } from "antd";

import culturlyLogo from "assets/images/logo.svg";
import RenderRoutes from "components/renderRoutes";

import "./style.scss";

const EventLayout = ({ routes }) => {
  return (
    <div className="user-event-management">
      <Space className="header w-full">
        <div>
          <img src={culturlyLogo} alt="Logo" />
        </div>
        <ul className="menu">
          <li>Venues</li>
          <li>Blogs</li>
          <li>Deals</li>
          <li>Testimonials</li>
        </ul>
        <div className="extra">
          <Space size={32}>
            <div>
              <p className="text-xl bold">+91 8852729162</p>
              <p className="text-base secondary">Let us help you decide</p>
            </div>
            <Button type="primary">Sign in</Button>
          </Space>
        </div>
      </Space>
      <div className="content">
        <RenderRoutes routes={routes} />
      </div>
    </div>
  );
};

export default EventLayout;
