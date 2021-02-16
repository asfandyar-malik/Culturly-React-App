import { Layout, Menu, Avatar, Dropdown } from "antd";
import { useState, useEffect } from "react";
import { matchPath, useHistory } from "react-router-dom";

import { ROUTES } from "../../routes";
import { userLogout } from "../../actions";
import { AUTHORIZATION_KEY } from "../../constants";

import logo from "../../images/logo.png";
import AccountHook from "../../hooks/account";

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
      <Header className="header">
        <div className="logo" style={{ backgroundImage: `url(${logo})` }} />
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
        <Sider width={200}>
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu.key]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {ROUTES.map((item) => {
              return (
                <Menu.Item key={item.key} onClick={() => onMenuItemClick(item)}>
                  {item.title}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AccountHook(AppLayout);
