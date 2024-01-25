import basicEvent from "./basicEvent";
import realAnimate from "./realAnimate";

export const configures = [
  // {
  //   name: "empty",
  //   desp: "无",
  //   children: [
  //     {
  //       name: "empty",
  //       desp: "无"
  //     }
  //   ]
  // },
  basicEvent,
  realAnimate,
];

export const getControllers = () => {
  const config = configures.filter((elem) => elem.name !== "empty");
  const map = {};
  config.forEach((lib) => {
    if (lib.children && lib.children.length) {
      lib.children.forEach((elem) => {
        map[elem.name] = {
          label: elem.desp,
          params: elem.params,
        };
      });
    }
  });
  return map;
};

export const controllers = getControllers();
