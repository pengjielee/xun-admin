import fetch from "@/utils/fetch";

export const getTopicList = (params) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics`,
    params,
  });

export const getTopicDetail = (id) =>
  fetch({
    url: `https://cnodejs.org/api/v1/topics/${id}`,
  });
