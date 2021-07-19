import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { SelfServiceError } from "@ory/kratos-client";

import { authPublicApi } from "../api/auth";
import * as utils from "../api/utils";

type ErrorState = {
  error?: object;
};

export default class Error extends React.Component<
  RouteComponentProps,
  ErrorState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const errorId = utils.parseUrlQuery("id", this.props.location) as string;
    if (errorId) {
      authPublicApi
        .getSelfServiceError(errorId, {
          withCredentials: true,
        })
        .then((res: AxiosResponse<SelfServiceError>) => {
          this.setState({ error: res.data });
        })
        .catch((err: AxiosError) => {
          this.setState({ error: err.toJSON() });
        });
    } else {
      const errorString = utils.parseUrlQuery(
        "error",
        this.props.location
      ) as string;
      if (errorString) {
        let error;
        try {
          error = JSON.parse(errorString);
        } catch {
          error = errorString;
        }
        this.setState({ error: error });
      } else {
        utils.redirectTo("/");
      }
    }
  }

  render() {
    if (this.state.error == null) return null;
    return (
      <div>
        <h2>Error</h2>
        <pre style={{ overflow: "scroll", height: "100%" }}>
          <code>{JSON.stringify(this.state.error, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
