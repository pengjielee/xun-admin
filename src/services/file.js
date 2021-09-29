import fetch from "@/utils/fetch";
import qs from "qs";

export const upload = (data) =>
  fetch({
    url: "/api/file/upload",
    data,
    method: "post",
    timeout: 120000,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploads = (data) =>
  fetch({
    url: "/api/file/uploads",
    data,
    method: "post",
    timeout: 120000,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const remove = (id) =>
  fetch({
    url: `/api/file/delete/${id}`,
    method: "post",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const exportNote = (params) =>
  (window.location.href = `http://localhost:3001/api/excel/export/note`);
