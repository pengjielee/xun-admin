// import type { AppProps } from "next/app";
import App from "next/app";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Menu, Breadcrumb, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileImageOutlined,
  SettingOutlined,
  LoginOutlined,
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "../assets/styles/globals.css";
import "../assets/styles/user.scss";
import "../assets/styles/app.scss";
import "../assets/styles/topic.scss";
import "../assets/styles/tool-mail.scss";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function MyApp({ Component, pageProps, pathname }) {
  const router = useRouter();
  const layout = Component.layout || "admin";

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  if (layout != "admin") {
    return <Component {...pageProps} />;
  }

  const handleLogOut = () => {
    router.replace("/user/login");
  };

  const menus = {
    "/": {
      selected: "1",
      sub: false,
    },
    "/note/list": {
      selected: "2",
      sub: false,
    },
    "/article/list": {
      selected: "3",
      sub: false,
    },
    "/tool/mail": {
      selected: "5",
      sub: true,
    },
    "/tool/wangeditor": {
      selected: "6",
      sub: true,
    },
  };
  const selectedKeys = [menus[pathname].selected] || ["1"];
  const openKeys = menus[pathname].sub
    ? ["sub", menus[pathname].selected]
    : [menus[pathname].selected];

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link href="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<MailOutlined />}>
              <Link href="/note/list">随记</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FileTextOutlined />}>
              <Link href="/article/list">文章</Link>
            </Menu.Item>
            <SubMenu key="sub" icon={<SettingOutlined />} title="工具">
              <Menu.Item key="5">
                <Link href="/tool/mail">生成邮箱签名</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link href="/tool/wangeditor">编辑器</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-main">
          <Header className="site-main-header">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "toggle",
                onClick: toggle,
              }
            )}

            <div className="logout" onClick={handleLogOut}>
              <LoginOutlined />
              <span className="text">登出</span>
            </div>
          </Header>
          <Content className="site-main-content">
            <Component {...pageProps} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const pathname = appContext.router.pathname || '/';

  return { ...appProps, pathname };
};

export default MyApp;
