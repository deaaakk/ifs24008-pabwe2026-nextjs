export const DELCOM_BASEURL =
  process.env.NEXT_PUBLIC_DELCOM_BASEURL?.replace(/\/+$/, "") ??
  "https://open-api.delcom.org/api/v1";

export const APP_PORT = Number.parseInt(process.env.APP_PORT ?? "3000", 10);
