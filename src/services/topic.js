import fetch from "@/utils/fetch";

export const list = (params) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics`,
    params,
  });

export const detail = (id) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics/${id}`,
  });
