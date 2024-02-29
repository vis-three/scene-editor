export const curveGenerator = {
  "2d": {
    line: (event) => ({
      curve: "line",
      params: [
        event.point.x,
        event.point.y,
        event.point.x + 1,
        event.point.y + 1,
      ],
    }),
    arc: (event) => ({
      curve: "arc",
      params: [
        event.point.x,
        event.point.y,
        event.point.x + 5,
        event.point.y - 5,
        event.point.x + 1,
        event.point.y + 1,
      ],
    }),
    cubic: (event) => ({
      curve: "cubic",
      params: [
        event.point.x,
        event.point.y,
        event.point.x + 5,
        event.point.y + 5,
        event.point.x + 5,
        event.point.y - 5,
        event.point.x + 1,
        event.point.y + 1,
      ],
    }),
    quadratic: (event) => ({
      curve: "quadratic",
      params: [
        event.point.x,
        event.point.y,
        event.point.x + 5,
        event.point.y + 5,
        event.point.x + 1,
        event.point.y + 1,
      ],
    }),
  },
  "3d": {
    line: (event) => ({
      curve: "line",
      params: [
        event.point.x,
        event.point.y,
        event.point.z,
        event.point.x + 1,
        event.point.y + 1,
        event.point.z + 1,
      ],
    }),
    cubic: (event) => ({
      curve: "cubic",
      params: [
        event.point.x,
        event.point.y,
        event.point.z,
        event.point.x + 5,
        event.point.y + 5,
        event.point.z + 5,
        event.point.x - 5,
        event.point.y - 5,
        event.point.z - 5,
        event.point.x + 1,
        event.point.y + 1,
        event.point.z + 1,
      ],
    }),
    quadratic: (event) => ({
      curve: "quadratic",
      params: [
        event.point.x,
        event.point.y,
        event.point.z,
        event.point.x + 5,
        event.point.y + 5,
        event.point.z + 5,
        event.point.x + 1,
        event.point.y + 1,
        event.point.z + 1,
      ],
    }),
  },
};

export const curveEditManager = {
  "2d": {
    line: (event, curve) => {
      curve.params[curve.params.length - 2] = event.point.x;
      curve.params[curve.params.length - 1] = event.point.y;
    },
    arc: (event, curve) => {
      curve.params[2] = (curve.params[0] + event.point.x) / 2 + 10;
      curve.params[3] = (curve.params[1] + event.point.y) / 2 - 5;
      curve.params[curve.params.length - 2] = event.point.x;
      curve.params[curve.params.length - 1] = event.point.y;
    },
    cubic: (event, curve) => {
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
      curve.params[length - 4] = (event.point.x + curve.params[0]) / 2 + 5;
      curve.params[length - 3] = (event.point.y + curve.params[1]) / 2 + 5;
      curve.params[length - 2] = event.point.x;
      curve.params[length - 1] = event.point.y;
    },
  },
  "3d": {
    line: (event, curve) => {
      curve.params[curve.params.length - 3] = event.point.x;
      curve.params[curve.params.length - 2] = event.point.y;
      curve.params[curve.params.length - 1] = event.point.z;
    },
    cubic: (event, curve) => {
      const length = curve.params.length;
      curve.params[3] = curve.params[0] + 5;
      curve.params[4] = curve.params[1] + 5;
      curve.params[5] = curve.params[2] + 5;

      curve.params[6] = event.point.x - 5;
      curve.params[7] = event.point.y - 5;
      curve.params[8] = event.point.z - 5;

      curve.params[length - 3] = event.point.x;
      curve.params[length - 2] = event.point.y;
      curve.params[length - 1] = event.point.z;
    },
    quadratic: (event, curve) => {
      const length = curve.params.length;
      curve.params[3] = (event.point.x + curve.params[0]) / 2 + 5;
      curve.params[4] = (event.point.y + curve.params[1]) / 2 + 5;
      curve.params[5] = (event.point.z + curve.params[2]) / 2 + 5;

      curve.params[length - 3] = event.point.x;
      curve.params[length - 2] = event.point.y;
      curve.params[length - 1] = event.point.z;
    },
  },
};
