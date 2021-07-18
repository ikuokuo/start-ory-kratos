import { AdminApi, PublicApi, Configuration } from "@ory/kratos-client";
import { config } from "../config";

export const authAdminApi = new AdminApi(
  new Configuration({
    basePath: config.kratos.adminUrl,
  })
);

export const authPublicApi = new PublicApi(
  new Configuration({
    basePath: config.kratos.publicUrl,
  })
);
