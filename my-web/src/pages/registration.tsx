import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosResponse } from "axios";
import {
  SelfServiceRegistrationFlow,
  SuccessfulSelfServiceRegistrationWithoutBrowser,
  UiText,
} from "@ory/kratos-client";
import { Alert, AlertProps, Card, Form, FormInstance } from "antd";

import { authPublicApi } from "../api/auth";
import * as ui from "../api/ui";
import * as utils from "../api/utils";

import "../styles/page.scss";

type RegistrationState = {
  flowId?: string;
  flow?: SelfServiceRegistrationFlow;
};

export default class Registration extends React.Component<
  RouteComponentProps,
  RegistrationState
> {
  private formRef = React.createRef<FormInstance<any>>();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const flowId = utils.parseUrlQuery("flow", this.props.location) as string;

    // The flow is used to identify the login and registration flow and
    // return data like the csrf_token and so on.
    if (!flowId || !utils.isString(flowId)) {
      console.log("No flow ID found in URL, initializing registration flow.");
      utils.redirectToSelfService("/self-service/registration/browser");
      return;
    }

    // Verify the client's registration flow.
    authPublicApi
      .getSelfServiceRegistrationFlow(flowId, undefined, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<SelfServiceRegistrationFlow>) => {
        if (utils.assertResponse(res)) {
          utils.redirectToSelfService("/self-service/registration/browser");
          return;
        }
        // console.log(res.data);
        this.setState({ flowId: flowId, flow: res.data });
      })
      .catch(utils.redirectOnError);
  }

  render() {
    if (this.state.flow == null) return null;
    const onFinish = (values: any) => {
      ui.submitViaForm(this.state.flow!.ui, values);
      // this.submitViaApi(values);
    };
    return (
      <div className="page">
        <div className="container" style={{ flex: "0 1 360px" }}>
          <Card title="Register new account" bordered={false}>
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
              name="register"
              ref={this.formRef}
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

  private submitViaApi(values: any): void {
    // Common Cookie and CSRF Pitfalls
    //  https://community.ory.sh/t/kratos-csrf-token-is-missing-or-invalid-when-post-data-to-registration-endpoint/1570/11
    authPublicApi
      .submitSelfServiceRegistrationFlow(
        this.state.flowId!,
        {
          csrf_token: values["csrf_token"],
          method: values["method"],
          password: values["password"],
          traits: {
            email: values["traits.email"],
            username: values["traits.username"],
            name: {
              first: values["traits.name.first"],
              last: values["traits.name.last"],
            },
          },
        },
        {
          withCredentials: true,
        }
      )
      .then(
        (
          res: AxiosResponse<SuccessfulSelfServiceRegistrationWithoutBrowser>
        ) => {
          console.log(res);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }
}
