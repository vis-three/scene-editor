// 引入UI组件库
import ElementUI from "element-ui";

ElementUI.Message.loading = function(config) {
  if (typeof config === "string") {
    return ElementUI.Message({
      type: "info",
      message: config,
      duration: 0,
      iconClass: "el-icon-loading"
    });
  } else {
    return ElementUI.Message({
      type: "info",
      message: "正在加载...",
      duration: 0,
      iconClass: "el-icon-loading",
      ...config
    });
  }
};

ElementUI.Notification.loading = function(config) {
  if (typeof config === "string") {
    return ElementUI.Notification({
      message: config,
      duration: 0,
      iconClass: "el-icon-loading"
    });
  } else {
    return ElementUI.Notification({
      message: "正在加载...",
      duration: 0,
      iconClass: "el-icon-loading",
      ...config
    });
  }
};
