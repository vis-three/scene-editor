export const curveGenerator = {
  line: (event) => ({
    curve: "line",
    params: [event.point.x, event.point.y, event.point.x, event.point.y],
  }),
  arc: (event) => ({
    curve: "arc",
    params: [
      event.point.x,
      event.point.y,
      10,
      false,
      event.point.x,
      event.point.y,
    ],
  }),
  bezier: (event) => ({
    curve: "bezier",
    params: [
      event.point.x,
      event.point.y,
      event.point.x + 5,
      event.point.y + 5,
      event.point.x + 5,
      event.point.y - 5,
      event.point.x,
      event.point.y,
    ],
  }),
  quadratic: (event) => ({
    curve: "quadratic",
    params: [
      event.point.x,
      event.point.y,
      event.point.x + 5,
      event.point.y + 5,
      event.point.x,
      event.point.y,
    ],
  }),
};

export const curveEditManager = {
  line: (event, curve) => {
    curve.params[curve.params.length - 2] = event.point.x;
    curve.params[curve.params.length - 1] = event.point.y;
  },
  arc: (event, curve) => {
    curve.params[curve.params.length - 2] = event.point.x;
    curve.params[curve.params.length - 1] = event.point.y;
  },
  bezier: (event, curve) => {
    const length = curve.params.length;
    curve.params[length - 6] = curve.params[0] + 5;
    curve.params[length - 5] = curve.params[1] + 5;
    curve.params[length - 4] = event.point.x + 5;
    curve.params[length - 3] = event.point.y - 5;
    curve.params[length - 2] = event.point.x;
    curve.params[length - 1] = event.point.y;
  },
  quadratic: (event, curve) => {
    const length = curve.params.length;
    curve.params[length - 4] = (event.point.x + curve.params[0]) / 2;
    curve.params[length - 3] = (event.point.y + curve.params[1]) / 2;
    curve.params[length - 2] = event.point.x;
    curve.params[length - 1] = event.point.y;
  },
};
