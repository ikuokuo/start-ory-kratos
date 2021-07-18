export const config = {
  baseUrl: (process.env.REACT_APP_BASE_URL || "http://127.0.0.1:3000") /**/
    .replace(/\/+$/, ""),
  kratos: {
    adminUrl: (
      process.env.REACT_APP_KRATOS_ADMIN_URL || "http://127.0.0.1:4434"
    ).replace(/\/+$/, ""),
    publicUrl: (
      process.env.REACT_APP_KRATOS_PUBLIC_URL || "http://127.0.0.1:4433"
    ).replace(/\/+$/, ""),
  },
};
