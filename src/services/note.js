import fetch from "@/utils/fetch";
import qs from "qs";

export const add = (data) =>
  fetch({
    url: `/api/note/add`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const update = (data) =>
  fetch({
    url: `/api/note/update`,
    method: "put",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
