import { useState, useEffect } from "react";
import { matchPath, useHistory } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Alert } from "antd";

import { ROUTES } from "routes";
import { userLogout } from "actions";
import { AUTHORIZATION_KEY } from "../../constants";

import logo from "assets/images/logo.svg";
import culturlyLogo from "../../images/culturly.jpeg";
import siderImage from "../../images/sider.png";
import headerImage from "../../images/header.png";

import AccountHook from "hooks/account";

const { Header, Content, Sider } = Layout;

const AppLayout = ({ children, accountData, setAccountData }) => {
  const history = useHistory();
  const { pathname } = history.location;

  const [selectedMenu, setSelectedMenu] = useState({});

  useEffect(() => {
    ROUTES.forEach((item) => {
      const matchedPath = matchPath(pathname, {
        path: item.path,
        exact: true,
      });
      if (matchedPath) {
        if (selectedMenu.key !== item.key) {
          setSelectedMenu(item);
        }
      }
    });
  }, [pathname]);

  function onMenuItemClick(item) {
    history.push(item.path);
  }

  function onLogout() {
    userLogout().then((response) => {
      setAccountData({});
      localStorage.removeItem(AUTHORIZATION_KEY);
    });
  }

  return (
    <Layout>
      <If condition={!accountData.member.is_manager}>
        <Alert
          banner
          message="You only have read access to the dashboard. If you need write access, please contact workspace administrator or manager."
        />
      </If>
      <Header className="header">
        <div className="logo" style={{ backgroundImage: `url(${logo})` }} />
        <img className="header-img" src={headerImage} alt="logo" />
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item onClick={() => onLogout()}>Logout</Menu.Item>
            </Menu>
          }
        >
          <div>
            <Avatar src={accountData.profile_pic} />
            <p>{accountData.name}</p>
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={240}>
          <div className="sider-inner">
            <div className="company-logo">
              <img src={culturlyLogo} alt="logo" />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedMenu.key]}
              style={{ borderRight: 0, background: "#f9feff" }}
            >
              {ROUTES.map((item) => {
                return (
                  <Menu.Item
                    key={item.key}
                    onClick={() => onMenuItemClick(item)}
                  >
                    {item.title}
                  </Menu.Item>
                );
              })}
            </Menu>
            <img className="sider-img" src={siderImage} alt="logo" />
          </div>
        </Sider>
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AccountHook(AppLayout);
