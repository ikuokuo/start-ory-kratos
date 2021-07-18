import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosResponse } from "axios";
import { LoginFlow } from "@ory/kratos-client";
import { Row, Col, Card, Form, Button, Divider } from "antd";

import { authPublicApi } from "../api/auth";
import * as ui from "../api/ui";
import * as utils from "../api/utils";

import "../styles/page.scss";

type LoginState = {
  flowId?: string;
  flow?: LoginFlow;
};

export default class Login extends React.Component<
  RouteComponentProps,
  LoginState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const flowId = utils.parseUrlQuery("flow", this.props.location) as string;

    if (!flowId || !utils.isString(flowId)) {
      console.log("No flow ID found in URL, initializing login flow.");
      utils.redirectToSelfService("/self-service/login/browser");
      return;
    }

    authPublicApi
      .getSelfServiceLoginFlow(flowId)
      .then((res: AxiosResponse<LoginFlow>) => {
        if (utils.assertResponse(res)) {
          utils.redirectToSelfService("/self-service/login/browser");
          return;
        }
        this.setState({ flowId: flowId, flow: res.data });
      })
      .catch(utils.redirectOnError);
  }

  render() {
    if (this.state.flow == null) return null;
    const onFinish = (values: any) => {
      ui.submitViaForm(this.state.flow!.ui, values);
    };
    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Login" bordered={false}>
            <Form
              name="register"
              encType="application/x-www-form-urlencoded"
              action={this.state.flow.ui.action}
              method={this.state.flow.ui.method}
              onFinish={onFinish}
            >
              {this.state.flow.ui.nodes.map((node, index) => {
                return React.cloneElement(ui.toUiNodeAntd(node)!, {
                  key: index,
                });
              })}
            </Form>
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
