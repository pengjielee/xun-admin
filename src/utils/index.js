import fetch from "./fetch";

export const isProd = process.env.NODE_ENV === "production";

export { fetch };
