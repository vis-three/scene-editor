const controllerMap = {
  input: "de-controller-input",
  switch: "de-controller-switch",
  select: "de-controller-select"
};

export const translater = configuration => {
  return configuration.map(item => {
    return {
      label: item.label || item.name,
      key: item.name,
      component: controllerMap[item.controller],
      props: {
        options: item.options
      }
    };
  });
};
