import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosResponse } from "axios";
import { SelfServiceSettingsFlow, UiNode, UiText } from "@ory/kratos-client";
import { Alert, AlertProps, Card, Form } from "antd";

import { authPublicApi } from "../api/auth";
import * as ui from "../api/ui";
import * as utils from "../api/utils";

import "../styles/page.scss";

type SettingsState = {
  flowId?: string;
  flow?: SelfServiceSettingsFlow;
};

export default class Settings extends React.Component<
  RouteComponentProps,
  SettingsState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const flowId = utils.parseUrlQuery("flow", this.props.location) as string;

    if (!flowId || !utils.isString(flowId)) {
      console.log("No request found in URL, initializing settings flow.");
      utils.redirectToSelfService("/self-service/settings/browser");
      return;
    }

    authPublicApi
      .getSelfServiceSettingsFlow(flowId, undefined, undefined, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<SelfServiceSettingsFlow>) => {
        if (utils.assertResponse(res)) {
          utils.redirectToSelfService("/self-service/settings/browser");
          return;
        }
        this.setState({ flowId: flowId, flow: res.data });
      })
      .catch(utils.redirectOnError);
  }

  render() {
    if (this.state.flow == null) return null;

    const nodesGroup: Record<
      string,
      {
        title?: string;
        nodes?: Array<UiNode>;
      }
    > = {
      default: {},
      profile: { title: "Profile" },
      password: { title: "Password" },
      oidc: { title: "Social Sign In" },
    };
    for (const [k, v] of Object.entries(nodesGroup)) {
      nodesGroup[k] = {
        title: v.title,
        nodes: ui.onlyNodes(this.state.flow!.ui.nodes, k),
      };
    }
    // console.log(nodesGroup);

    const onFinish = (values: any) => {
      ui.submitViaForm(this.state.flow!.ui, values);
    };

    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Settings" bordered={false}>
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
            {/* Split Form by group here. Otherwise, one AntD Form method conflicts. */}
            {Object.entries(nodesGroup)
              .filter(([k, v]) => k !== "default" && v && v.nodes!.length > 0)
              .map(([k, v], index) => (
                <Form
                  key={index}
                  name={k}
                  encType="application/x-www-form-urlencoded"
                  action={this.state.flow!.ui.action}
                  method={this.state.flow!.ui.method}
                  onFinish={onFinish}
                >
                  <Form.Item>
                    <div>{v.title}</div>
                  </Form.Item>
                  {v
                    .nodes!.concat(nodesGroup["default"].nodes!)
                    .map((node, index) => {
                      return React.cloneElement(ui.toUiNodeAntd(node)!, {
                        key: index,
                      });
                    })}
                </Form>
              ))}
          </Card>
        </div>
      </div>
    );
  }
}
