import { V0alpha1Api, Configuration } from "@ory/kratos-client";
import { config } from "../config";

export const authAdminApi = new V0alpha1Api(
  new Configuration({
    basePath: config.kratos.adminUrl,
  })
);

export const authPublicApi = new V0alpha1Api(
  new Configuration({
    basePath: config.kratos.publicUrl,
  })
);
