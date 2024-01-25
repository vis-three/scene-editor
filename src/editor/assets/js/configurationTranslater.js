const controllerMap = {
  input: "de-controller-input",
  number: "de-controller-number",
  switch: "de-controller-switch",
  select: "de-controller-select",
  picker: "de-controller-picker",
  textarea: "de-controller-textarea",
  code: "de-controller-code",
  vector2: "de-controller-vector2",
  vector3: "de-controller-vector3",
  "vector3-color": "de-controller-vector3-color",
};

export const translater = (configuration) => {
  return configuration.map((item) => {
    return {
      label: item.label || item.name,
      key: item.name,
      component: controllerMap[item.controller],
      props: {
        options: item.options,
        ...item.setting,
      },
    };
  });
};
