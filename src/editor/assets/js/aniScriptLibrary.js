export default {
  linearTime: {
    name: "linearTime",
    desp: "线性时间",
    controllers: [
      {
        label: "时间倍率",
        key: "multiply",
        component: "de-controller-number",
        props: {
          min: 0,
        },
      },
    ],
  },
  sinWave: {
    name: "sinWave",
    desp: "正弦波",
    controllers: [
      {
        label: "波长",
        key: "wavelength",
        component: "de-controller-number",
        props: {},
      },
      {
        label: "偏移量",
        key: "offset",
        component: "de-controller-number",
        props: {},
      },
      {
        label: "振幅",
        key: "amplitude",
        component: "de-controller-number",
        props: {},
      },
      {
        label: "速度",
        key: "speed",
        component: "de-controller-number",
        props: {},
      },
    ],
  },
};
