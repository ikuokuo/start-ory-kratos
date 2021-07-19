import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AxiosResponse } from "axios";
import { SelfServiceLogoutUrl } from "@ory/kratos-client";
import { Button, Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import Dashboard from "./pages/dashboard";
import Error from "./pages/error";
import Login from "./pages/login";
import Recovery from "./pages/recovery";
import Registration from "./pages/registration";
import Settings from "./pages/settings";
import Verification from "./pages/verification";

import logo from "./logo.svg";
import "./App.scss";

import { authPublicApi } from "./api/auth";

const { Header, Sider, Content } = Layout;

type AppHeaderState = {
  menuSelectedKey: string;
  logoutUrl?: string;
};

class App extends React.Component<RouteComponentProps, AppHeaderState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      menuSelectedKey: "dashboard",
    };
  }

  componentDidMount() {
    let menuSelectedKey = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    if (menuSelectedKey.length === 0) menuSelectedKey = "dashboard";
    this.setState({ menuSelectedKey: menuSelectedKey });

    if (["dashboard", "settings", "verify"].indexOf(menuSelectedKey) > -1) {
      authPublicApi
        .createSelfServiceLogoutFlowUrlForBrowsers(undefined, {
          withCredentials: true,
        })
        .then((res: AxiosResponse<SelfServiceLogoutUrl>) => {
          this.setState({ logoutUrl: res.data.logout_url });
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  }

  render() {
    return (
      <Layout className="App">
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div style={{ flex: "auto" }}>My Web</div>
          {this.state.logoutUrl && (
            <Button
              type="link"
              shape="circle"
              href={this.state.logoutUrl}
              icon={<LogoutOutlined />}
            />
          )}
        </Header>
        <Layout>
          <AppSider menuSelectedKey={this.state.menuSelectedKey} />
          <Content className="App-content">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/auth/registration" component={Registration} />
              <Route path="/auth/login" component={Login} />
              <Route path="/recovery" component={Recovery} />
              <Route path="/settings" component={Settings} />
              <Route path="/verify" component={Verification} />
              <Route path="/error" component={Error} />
              <Route component={Error} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

type AppSiderProps = {
  menuSelectedKey: string;
};

class AppSider extends React.Component<AppSiderProps> {
  render() {
    return (
      <Sider width={200} className="App-sider">
        <Menu
          defaultSelectedKeys={[this.props.menuSelectedKey]}
          style={{ height: "100%" }}
        >
          <Menu.Item key="dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="registration">
            <Link to="/auth/registration">Registration</Link>
          </Menu.Item>
          <Menu.Item key="login">
            <Link to="/auth/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="recovery">
            <Link to="/recovery">Recovery</Link>
          </Menu.Item>
          <Menu.Item key="settings">
            <Link to="/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item key="verify">
            <Link to="/verify">Verify</Link>
          </Menu.Item>
          <Menu.Item key="error">
            <Link to="/error">Error</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(App);
