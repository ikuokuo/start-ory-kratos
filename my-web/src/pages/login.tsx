import React from "react";
import { Row, Col, Card, Input, Button, Divider } from "antd";

import "../styles/page.scss";

export default class Login extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Login" bordered={false}>
            <Input placeholder="Username / E-Mail" />
            <Input.Password placeholder="Password" style={{ marginTop: 16 }} />
            <Button type="primary" block style={{ marginTop: 16 }}>
              Sign in
            </Button>
            <Divider />
            <Row>
              <Col span={12}>
                <Button
                  type="link"
                  href="/auth/registration"
                  style={{ padding: 0 }}
                >
                  Register new account
                </Button>
              </Col>
              <Col span={12}>
                <Button type="link" href="/recovery" style={{ padding: 0 }}>
                  Reset password
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}
