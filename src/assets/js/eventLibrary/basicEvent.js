export default {
  name: "BasicEvent",
  desp: "基础事件",
  children: [
    {
      name: "openWindow",
      desp: "打开新窗口",
      params: [
        {
          label: "链接地址",
          key: "url",
          component: "de-controller-input",
          props: {}
        }
      ]
    },
    {
      name: "visibleObject",
      desp: "显示物体",
      params: [
        {
          label: "目标物体",
          key: "target",
          component: "de-controller-select",
          props: {
            options: "objects"
          }
        },
        {
          label: "显示",
          key: "visible",
          component: "de-controller-switch",
          props: {}
        },
        {
          label: "延迟时长",
          key: "delay",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
          }
        }
      ]
    },
    {
      name: "changeScene",
      desp: "切换场景",
      params: [
        {
          label: "场景",
          key: "scene",
          component: "de-controller-select",
          props: {
            options: "scenes"
          }
        },
        {
          label: "延迟时长",
          key: "delay",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
          }
        }
      ]
    },
    {
      name: "changeCamera",
      desp: "切换相机",
      params: [
        {
          label: "相机",
          key: "camera",
          component: "de-controller-select",
          props: {
            options: "cameras"
          }
        },
        {
          label: "延迟时长",
          key: "delay",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
          }
        }
      ]
    },
    {
      name: "switchAnimate",
      desp: "动画控制",
      params: [
        {
          label: "目标动画",
          key: "target",
          component: "de-controller-select",
          props: {
            options: "animations"
          }
        },
        {
          label: "切换",
          key: "toggle",
          component: "de-controller-select",
          props: {
            options: [
              { label: "开", value: "on" },
              { label: "关", value: "off" },
              { label: "自动", value: "auto" }
            ]
          }
        },
        {
          label: "延迟时长",
          key: "delay",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
          }
        }
      ]
    }
  ]
};
