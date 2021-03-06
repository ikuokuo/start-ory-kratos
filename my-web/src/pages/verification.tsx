import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosResponse } from "axios";
import { SelfServiceVerificationFlow, UiText } from "@ory/kratos-client";
import { Alert, AlertProps, Card, Form } from "antd";

import { authPublicApi } from "../api/auth";
import * as ui from "../api/ui";
import * as utils from "../api/utils";

import "../styles/page.scss";

type VerificationState = {
  flowId?: string;
  flow?: SelfServiceVerificationFlow;
};

export default class Verification extends React.Component<
  RouteComponentProps,
  VerificationState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const flowId = utils.parseUrlQuery("flow", this.props.location) as string;

    if (!flowId || !utils.isString(flowId)) {
      console.log("No request found in URL, initializing verification flow.");
      utils.redirectToSelfService("/self-service/verification/browser");
      return;
    }

    authPublicApi
      .getSelfServiceVerificationFlow(flowId, undefined, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<SelfServiceVerificationFlow>) => {
        if (utils.assertResponse(res)) {
          utils.redirectToSelfService("/self-service/verification/browser");
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
          <Card title="Verification" bordered={false}>
            {this.state.flow.ui.messages &&
              this.state.flow.ui.messages.map((m: UiText, index) => (
                <Alert
                  key={index}
                  message={m.text}
                  type={m.type as AlertProps["type"]}
                  style={{ marginBottom: 16 }}
                  showIcon
                />
              ))}
            <Form
              name="verification"
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
          </Card>
        </div>
      </div>
    );
  }
}
