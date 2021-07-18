import { AxiosError } from "axios";
import { Location } from "history";
import * as queryString from "query-string";
import { config } from "./config";

export const isString = (x: any): x is string => typeof x === "string";

export const parseUrlQuery = (
  search: string,
  location?: Location
): string | string[] => {
  const params = queryString.parse((location && location.search) || "");
  const result = params[search] as string | string[];
  return result;
};

export const redirectTo = (endpoint: string) => {
  window.location.href = `${endpoint}`;
};

export const redirectToSelfService = (endpoint: string) => {
  window.location.href = `${config.kratos.publicUrl}${endpoint}`;
};

export const assertResponse = (res: any) => {
  // No-response = no-good
  if (!res) return 1;

  // Kratos does not respond with any success besides status 200;
  // something is wrong if it does, let's reinitalize.
  if (res.status !== 200) return 1;

  // `type` should either be 'browser' or 'api'. We do NOT need the API registration-flow
  // so something has clearly gone astray; restart the flow.
  if (res.data.type !== "browser") return 1;

  // false
  return 0;
};

// Redirects to the specified URL if the error is an AxiosError with a 404, 410,
// or 403 error code.
export const redirectOnError = (err: AxiosError) => {
  if (!err.response) {
    return;
  }

  const res = err.response;

  // console.log(`redirectOnError: ${JSON.stringify(res.data.error)}`);
  if (res.status === 404 || res.status === 410 || res.status === 403) {
    redirectTo(res.data.error.details.redirect_to);
  } else if (res.status === 404) {
    redirectTo(config.baseUrl);
  } else {
    console.log(`redirectOnError unknown: ${JSON.stringify(res)}`);
  }
};
