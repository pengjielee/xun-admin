import fetch from "@/utils/fetch";

export const login = (params) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics`,
    params,
  });

export const register = (params) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics`,
    params,
  });
