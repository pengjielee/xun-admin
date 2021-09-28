import fetch from "@/utils/fetch";
import qs from "qs";

const baseUrl = "";

export const add = (data) =>
  fetch({
    url: `${baseUrl}/api/article/add`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const update = (data) =>
  fetch({
    url: `${baseUrl}/api/article/update`,
    method: "put",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
