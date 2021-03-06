import fetch from "@/utils/fetch";
import qs from "qs";

//获取活动列表
export const list = (params) =>
  fetch({
    url: `/api/activity/list`,
    params,
  });

//获取活动详情
export const draft = (id) =>
  fetch({
    url: `/api/activity/draft/${id}`,
  });

export const detailById = (id) =>
  fetch({
    url: `/api/activity/byid/${id}`,
  });

export const detailByUrl = (url) =>
  fetch({
    url: `/api/activity/byurl/${url}`,
  });

//添加活动
export const add = (data) =>
  fetch({
    url: `/api/activity/add`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

//更新活动
export const update = (data) =>
  fetch({
    url: `/api/activity/update`,
    method: "put",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const publish = (id) =>
  fetch({
    url: `/api/activity/publish/${id}`,
    method: "post",
  });

export const online = (id) =>
  fetch({
    url: `/api/activity/online/${id}`,
    method: "post",
  });

export const offline = (id) =>
  fetch({
    url: `/api/activity/offline/${id}`,
    method: "post",
  });

export const getModule = (id) =>
  fetch({
    url: `/api/activity/module/${id}`,
  });

//添加活动
export const addModule = (data) =>
  fetch({
    url: `/api/activity/module/add`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const updateModule = (data) =>
  fetch({
    url: `/api/activity/module/update`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

export const deleteModule = (params) =>
  fetch({
    url: `/api/activity/module/delete/${params.activity_id}/${params.id}`,
    method: "post",
  });

//更新活动状态
export const changeStatus = (data) =>
  fetch({
    url: `/api/activity/change-status`,
    method: "put",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

//复制活动
export const copy = (data) =>
  fetch({
    url: `/api/activity/copy`,
    method: "post",
    data: qs.stringify(data),
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
