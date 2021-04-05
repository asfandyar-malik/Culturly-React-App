import { useState, useEffect } from "react";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { Avatar, Layout, Menu, Space, Dropdown, Row, Col } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { ROUTES, INDEX_ROUTE } from "routes";
import { AUTHORIZATION_KEY } from "../../constants";

import AccountHook from "hooks/account";
import culturlyLogo from "../../images/culturly.jpeg";
import siderImage from "../../images/sider.png";
import headerImage from "../../images/header.png";

import RenderRoutes from "components/renderRoutes";

import "./style.scss";

const { Header, Content, Sider } = Layout;

const AppLayout = ({ accountData, setAccountData, routes }) => {
  const history = useHistory();
  const { pathname } = useLocation();
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

  const onLogout = () => {
    setAccountData({});
    localStorage.removeItem(AUTHORIZATION_KEY);
    history.push(INDEX_ROUTE);
  };

  const onMenuItemClick = (menutItem) => {
    const item = ROUTES.find((i) => i.key === menutItem.key);
    if (item.path) {
      history.push(item.path);
    } else {
      window.open(item.url, "_blank");
    }
  };

  return (
    <Layout className="app-layout">
      <Sider theme="light" width={240}>
        <div className="sider-inner">
          <div className="company-logo">
            <img src={culturlyLogo} alt="logo" />
          </div>
          <Menu theme="light" mode="inline" selectedKeys={[selectedMenu.key]}>
            {ROUTES.map((item) => {
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
        </div>
      </Sider>
      <Layout>
        <Header>
          <Row justify="space-between" align="middle">
            <Col>
              <p className="text-5xl bold uppercase">{selectedMenu?.title}</p>
            </Col>
            <Col>
              <Dropdown
                overlay={
                  <Menu>
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
          <img className="header-img" src={headerImage} alt="logo" />
        </Header>
        <Content>
          <RenderRoutes routes={routes} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AccountHook(AppLayout);
