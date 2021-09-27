import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const fetch = axios.create({
  baseURL: "",
  timeout: 20000,
  cancelToken: source.token,
  headers: {
    "Cache-Control": "no-cache",
  },
});

fetch.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

fetch.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response ? error.response.data : {});
  }
);

export default fetch;
