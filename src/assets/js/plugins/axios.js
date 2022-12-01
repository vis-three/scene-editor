import axios from "axios";
import Cookies from "js-cookie";
import { Message } from "element-ui";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: "/",
  Headers: {
    Authorization: "Bearer",
  },
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = Cookies.get("accessToken");

    accessToken && (config.headers.Authorization = `Bearer ${accessToken}`);

    return config;
  },
  function (error) {
    // Do something with request error
    Message.error(JSON.stringify(error));
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data

    if (response.status === 200) {
      return response.data;
    } else {
      Message.error(response.data.message);
    }
  },
  function (error) {
    const response = error.response;
    if (response.status === 404) {
      Message({
        type: "error",
        message: response.data.message,
        onClose: () => {
          // window.location.href = "/404.html";
        },
      });

      return;
    }

    if (response.status === 401) {
      Message({
        type: "error",
        message: response.data.message,
        onClose: () => {
          window.location.href = "/login.html";
        },
      });

      return;
    }

    if (response.status === 400) {
      Message({
        type: "error",
        message: response.data.message,
      });

      return;
    }
    // Do something with response error
    Message.error(response.data.message || error.message);
    return Promise.reject(error);
  }
);

_axios.upload = function (url, formData) {
  const file = formData.get("file");
  const fileName = file ? file.name : "";

  const message = Message({
    message: `正在上传${fileName}：0%`,
    duration: 0,
    type: "info",
  });
  return new Promise((resolve, reject) => {
    _axios
      .post(url, formData, {
        "Content-type": "multipart/form-data",
        onUploadProgress: (event) => {
          message.message = `正在上传${fileName}：${Math.round(
            (event.loaded / event.total) * 100
          )}% `;
        },
      })
      .then((res) => {
        if (res.status === 200) {
          message.type = "success";
          message.message = "上传成功！";
          resolve(res);
        } else {
          message.type = "error";
          message.message = "上传失败:" + res.message;
          reject(res);
        }
      })
      .catch((err) => {
        message.type = "error";
        message.message = "上传失败:" + err.message;
        reject(err);
      })
      .finally(() => {
        setTimeout(() => {
          message.close();
        }, 1000);
      });
  });
};

export const Plugin = {
  install(Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return _axios;
        },
      },
      $axios: {
        get() {
          return _axios;
        },
      },
    });
  },
};

export default _axios;
