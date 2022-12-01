export default {
  name: "RealAnimate",
  desp: "实时动画",
  children: [
    {
      name: "moveSpacing",
      desp: "移动距离",
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
          label: "距离",
          key: "spacing",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "moveTo",
      desp: "移动到",
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
          label: "位置",
          key: "position",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "rotationTo",
      desp: "旋转到",
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
          label: "旋转",
          key: "rotation",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2,
            unit: "°"
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "upTo",
      desp: "正向到",
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
          label: "正向",
          key: "up",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "moveToObject",
      desp: "移动到物体",
      params: [
        {
          label: "物体",
          key: "target",
          component: "de-controller-select",
          props: {
            options: "objects"
          }
        },
        {
          label: "目标物体",
          key: "to",
          component: "de-controller-select",
          props: {
            options: "objects"
          }
        },
        {
          label: "偏移",
          key: "offset",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "moveFromTo",
      desp: "从起始移动到结束位置",
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
          label: "起始",
          key: "from",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "结束",
          key: "to",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "focusObject",
      desp: "聚焦物体",
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
          label: "指定相机（可选）",
          key: "camera",
          component: "de-controller-select",
          props: {
            options: "cameras"
          }
        },
        {
          label: "坐标空间",
          key: "space",
          component: "de-controller-select",
          props: {
            options: [
              {
                label: "本地",
                value: "local"
              },
              {
                label: "世界",
                value: "world"
              }
            ]
          }
        },
        {
          label: "偏移量",
          key: "offset",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "是否返回",
          key: "back",
          component: "de-controller-switch",
          props: {}
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "showToCamera",
      desp: "展示到相机",
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
          label: "偏移量",
          key: "offset",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "fadeObject",
      desp: "淡入淡出物体",
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
          label: "方向",
          key: "direction",
          component: "de-controller-select",
          props: {
            options: [
              { label: "淡入", value: "in" },
              { label: "淡出", value: "out" }
            ]
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        },
        {
          label: "影响显示",
          key: "visible",
          component: "de-controller-switch",
          props: {}
        }
      ]
    },
    {
      name: "colorChange",
      desp: "材质变色",
      params: [
        {
          label: "目标物体",
          key: "target",
          component: "de-controller-select",
          props: {
            options: "materials"
          }
        },
        {
          label: "属性",
          key: "attribute",
          component: "de-controller-select",
          props: {
            options: [
              { label: "颜色", value: "color" },
              { label: "发光", value: "emssive" }
            ]
          }
        },
        {
          label: "目标颜色",
          key: "color",
          component: "de-controller-picker",
          props: {}
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    },
    {
      name: "orbitTargetMove",
      desp: "轨道目标移动",
      params: [
        {
          label: "目标物体（可选）",
          key: "target",
          component: "de-controller-select",
          props: {
            options: "objects"
          }
        },
        {
          label: "偏移量",
          key: "offset",
          component: "de-controller-vector3",
          props: {
            step: 1,
            displayAccuracy: 2
          }
        },
        {
          label: "动画时长",
          key: "duration",
          component: "de-controller-number",
          props: {
            step: 1,
            displayAccuracy: 0,
            min: 0
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
        },
        {
          label: "动画曲线",
          key: "timingFunction",
          component: "de-controller-select",
          props: {
            options: "timingFunction"
          }
        }
      ]
    }
  ]
};
