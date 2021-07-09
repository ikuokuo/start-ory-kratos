import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Layout, Menu } from "antd";

import Dashboard from "./pages/dashboard";
import Error from "./pages/error";
import Login from "./pages/login";
import Recovery from "./pages/recovery";
import Registration from "./pages/registration";
import Settings from "./pages/settings";
import Verification from "./pages/verification";

import logo from "./logo.svg";
import "./App.scss";

const { Header, Sider, Content } = Layout;

class App extends React.Component {
  render() {
    return (
      <Layout className="App">
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>My Web</div>
        </Header>
        <Layout>
          <Router>
            <AppSiderWithRouter />
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
          </Router>
        </Layout>
      </Layout>
    );
  }
}

class AppSider extends React.Component<RouteComponentProps> {
  render() {
    const menuItemKey = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    return (
      <Sider width={200} className="App-sider">
        <Menu defaultSelectedKeys={[menuItemKey]} style={{ height: "100%" }}>
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

const AppSiderWithRouter = withRouter(AppSider);

export default App;
