import React from "react";
import { Input, Button, Divider, Space } from "antd";

export default class Settings extends React.Component {
  render() {
    return (
      <div
        className="page"
        style={{ flexDirection: "column", alignItems: "start" }}
      >
        <h2 style={{ flex: "none", margin: 0 }}>Settings</h2>
        <Divider style={{ flex: "none" }} />
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
            width: 360,
            flex: "auto",
            alignSelf: "center",
          }}
        >
          <h3>Profile</h3>
          <Input placeholder="E-Mail" />
          <Input placeholder="Username" />
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
          <Button type="primary" block>
            Save
          </Button>
          <h3>Password</h3>
          <Input.Password placeholder="Password" />
          <Button type="primary" block>
            Save
          </Button>
        </Space>
      </div>
    );
  }
}
