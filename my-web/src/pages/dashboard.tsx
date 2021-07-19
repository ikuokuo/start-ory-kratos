import React from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Session } from "@ory/kratos-client";

import { authPublicApi } from "../api/auth";
import * as utils from "../api/utils";

type DashboardState = {
  session?: Session;
};

export default class Dashboard extends React.Component<{}, DashboardState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Method whoami is changed to toSession?
    //  https://github.com/ory/kratos/issues/1405
    authPublicApi
      .toSession(undefined, undefined, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<Session>) => {
        if (utils.assertResponse(res)) {
          utils.redirectToSelfService("/self-service/login/browser");
          return;
        }
        // console.log(res);
        this.setState({ session: res.data });
      })
      .catch((err: AxiosError) => utils.redirectOnError(err, "/auth/login"));
  }

  render() {
    if (this.state.session == null) return null;
    const { session } = this.state;
    return (
      <div style={{ overflow: "scroll", height: "100%" }}>
        <h2>
          Welcome back, <span>{session.identity.traits.email}</span>!
        </h2>
        <p>Hello, nice to have you! You signed up with this data:</p>
        <pre>
          <code>{JSON.stringify(session.identity.traits, null, 2)}</code>
        </pre>

        <p>The decoded ORY Kratos Session payload is as follows:</p>
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
