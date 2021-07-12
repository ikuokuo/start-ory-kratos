import React from "react";
import { Card, Input, Button } from "antd";

import "../styles/page.scss";

export default class Recovery extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Reset password" bordered={false}>
            <Input placeholder="E-Mail" />
            <Button type="primary" block style={{ marginTop: 16 }}>
              Sign up
            </Button>
          </Card>
        </div>
      </div>
    );
  }
}
