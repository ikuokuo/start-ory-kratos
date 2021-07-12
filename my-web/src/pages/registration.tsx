import React from "react";
import { Card, Input, Button, Space } from "antd";

import "../styles/page.scss";

export default class Registration extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Register new account" bordered={false}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Input placeholder="E-Mail" />
              <Input.Password placeholder="Password" />
              <Input placeholder="Username" />
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
              <Button type="primary" block>
                Sign up
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    );
  }
}
