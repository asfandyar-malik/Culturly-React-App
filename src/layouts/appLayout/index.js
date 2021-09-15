import { useState, useEffect } from "react";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { Avatar, Layout, Menu, Space, Dropdown, Row, Col } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { AUTHORIZATION_KEY } from "../../constants";
import { ROUTES, INDEX_ROUTE, SETTINGS_ROUTE, MEMBERS_ROUTE } from "routes";

import AccountHook from "hooks/account";
import siderImage from "assets/images/sider.png";
import headerImage from "assets/images/header.png";
import culturlyLogo from "assets/images/culturly.jpeg";

import RenderRoutes from "components/renderRoutes";

import "./style.scss";

const { Header, Content, Sider } = Layout;

const AppLayout = ({ accountData, setAccountData, routes }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [selectedMenu, setSelectedMenu] = useState({});
  const [sideBarRoutes, setSideBarRoutes] = useState([]);

  useEffect(() => {
    let routes = [];
    const { member = {} } = accountData;
    if (member.is_admin) {
      routes = ROUTES.filter((item) => item.roles.includes("admin"));
    } else if (member.is_manager) {
      routes = ROUTES.filter((item) => item.roles.includes("manager"));
    } else {
      routes = ROUTES.filter((item) => item.roles.includes("member"));
    }
    if (!accountData?.workspace?.is_leaderboard_enabled) {
      routes = routes.filter((item) => !item.is_leaderboard_enabled);
    }
    setSideBarRoutes(routes);
  }, [accountData]);

  useEffect(() => {
    sideBarRoutes.forEach((item) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, sideBarRoutes]);

  const onLogout = () => {
    setAccountData({});
    localStorage.removeItem(AUTHORIZATION_KEY);
    history.push(INDEX_ROUTE);
  };

  const onMenuItemClick = (menutItem) => {
    const item = sideBarRoutes.find((i) => i.key === menutItem.key);
    if (item.path) {
      history.push(item.path);
    } else {
      window.open(item.url, "_blank");
    }
  };

  return (
    <>
      <Layout className="app-layout">
        <Sider theme="light" width={240}>
          <div className="company-logo">
            <img src={culturlyLogo} alt="logo" />
          </div>
          <Menu theme="light" mode="inline" selectedKeys={[selectedMenu.key]}>
            {sideBarRoutes
              .filter((item) => !item.isHidden)
              .map((item) => {
                return (
                  <Menu.Item key={item.key} onClick={onMenuItemClick}>
                    <Space>
                      {item.icon}
                      {item.title}
                    </Space>
                  </Menu.Item>
                );
              })}
          </Menu>
          <img className="sider-img" src={siderImage} alt="logo" />
        </Sider>
        <Layout>
          <Header>
            <Row justify="space-between" align="middle">
              <Col>
                <p className="text-5xl bolder uppercase">{selectedMenu?.title}</p>
              </Col>
              <Col>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => history.push(MEMBERS_ROUTE)}>
                        Management
                      </Menu.Item>
                      <Menu.Item onClick={() => history.push(SETTINGS_ROUTE)}>
                        Settings
                      </Menu.Item>
                      <Menu.Item onClick={onLogout}>Logout</Menu.Item>
                    </Menu>
                  }
                >
                  <Space className="text-xl medium">
                    <Avatar src={accountData.profile_pic} size="large" />
                    <p>Hi, {accountData.name}</p>
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </Col>
            </Row>
            <img className="header-img" src={headerImage} alt="header" />
          </Header>
          <Content>
            <RenderRoutes routes={routes} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AccountHook(AppLayout);
