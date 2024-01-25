import Vue from "vue";
import { InterpolateLinear, InterpolateDiscrete } from "three";

class Interpolation {
  // 包前不包后
  static get({ interpolate, beginValue, endValue, number, type }) {
    const actionMap = {};
    actionMap[InterpolateLinear] = () =>
      Interpolation.interpolateLinear({ beginValue, endValue, number, type });
    return actionMap[interpolate]();
  }

  static interpolateLinear({ beginValue, endValue, number, type }) {
    const linearAlgorithm = (beginValue, endValue, number) => {
      const list = new Array(number).fill(beginValue);
      const step = (endValue - beginValue) / number;
      list.forEach((value, i, arr) => {
        arr[i] = beginValue + step * i;
      });

      return list;
    };

    let list = new Array(number).fill(beginValue);

    const typeAction = {
      number: () => {
        list = linearAlgorithm(beginValue, endValue, number);
      },
      color: () => {
        const [beginR, beginG, beginB] = beginValue
          .slice(4, -1)
          .split(",")
          .map((elem) => Number(elem.trim()));
        const [endR, endG, endB] = endValue
          .slice(4, -1)
          .split(",")
          .map((elem) => Number(elem.trim()));
        const rList = linearAlgorithm(beginR, endR, number);
        const gList = linearAlgorithm(beginG, endG, number);
        const bList = linearAlgorithm(beginB, endB, number);
        rList.forEach((value, i, arr) => {
          list[i] = `rgb(${Math.round(rList[i])}, ${Math.round(
            gList[i]
          )}, ${Math.round(bList[i])})`;
        });
      },
      vector3: () => {
        const xList = linearAlgorithm(beginValue.x, endValue.x, number);
        const yList = linearAlgorithm(beginValue.y, endValue.y, number);
        const zList = linearAlgorithm(beginValue.z, endValue.z, number);
        xList.forEach((value, i, arr) => {
          list[i] = {
            x: xList[i],
            y: yList[i],
            z: zList[i],
          };
        });
      },
    };
    typeAction[type]();
    return list;
  }
}

const module = {
  namespaced: true,
  state: {
    renderStart: 0,
    renderEnd: 150,
    map: {
      // ambientLight: {
      //   instensity: [0, 0, 0, 0]
      // }
    },
    cacheMap: {
      // 不需要进入vue
      // 0: [
      //   {
      //     target
      //     attribute
      //     value
      //   }
      // ]
    },
    cacheSignMap: {},
  },
  getters: {
    renderStart(state) {
      return state.renderStart;
    },
    renderEnd(state) {
      return state.renderEnd;
    },
    cacheSignMap(state) {
      return state.cacheSignMap;
    },
  },
  mutations: {
    renderStart(state, value) {
      if (value < 0) {
        state.renderStart = 0;
      } else if (value > state.renderEnd) {
        state.renderStart = state.renderEnd;
      } else {
        state.renderStart = value;
      }
    },
    renderEnd(state, value) {
      const totalFrame = this.getters["animation/totalFram"];
      if (value > totalFrame) {
        state.renderEnd = totalFrame;
      } else if (value < state.renderStart) {
        state.renderEnd = state.renderStart;
      } else {
        state.renderEnd = value;
      }
    },

    previewChache(state, frame) {
      if (state.cacheSignMap[frame]) {
        const frameList = state.cacheMap[frame];
        frameList.forEach((elem) => {
          if (elem.attribute.includes(".")) {
            const path = elem.attribute.split(".");
            const key = path.pop();
            let target = elem.target;
            path.forEach((attribute) => {
              target = target[attribute];
            });
            target[key] = elem.value;
          } else {
            elem.target[elem.attribute] = elem.value;
          }
        });
      } else {
        this.commit("preRenderArea/generateFrameChache", frame);
        this.dispatch("preRenderArea/previewChache", frame);
      }
    },

    generateCacheSignMap(state) {
      const list = Vue.observable(
        new Array(this.getters["animation/totalFrame"] + 1).fill(false)
      );
      state.cacheSignMap = list;
    },

    generateFrameChache(state, frame) {
      if (!state.cacheMap[frame]) {
        state.cacheMap[frame] = [];
      }
      const cacheFrame = state.cacheMap[frame];

      const map = state.map;
      Object.keys(map).forEach((vid) => {
        const attributeMap = map[vid];
        const target = this.getters["attribute/getConfig"](vid);
        Object.keys(attributeMap).forEach((attribute) => {
          const frameTrack = attributeMap[attribute];
          if (frameTrack[frame]) {
            cacheFrame.push({
              target,
              attribute,
              value: frameTrack[frame],
            });
          }
        });
      });
      Vue.set(state.cacheSignMap, frame, true);
    },

    clearFrameChache(state, frame) {
      delete state.cacheMap[frame];
      Vue.set(state.cacheSignMap, frame, false);
    },

    clearFrameRangeChache(state, { beginFrame, endFrame }) {
      if (endFrame === this.getters["animation/totalFrame"]) {
        endFrame += 1;
      }
      const number = endFrame - beginFrame;
      for (let i = 0; i < number; i += 1) {
        Vue.delete(state.cacheMap, beginFrame + i);
        Vue.set(state.cacheSignMap, beginFrame + i, false);
      }
    },
    generateKeyframeChache(
      state,
      { frame, lastFrame, nextFrame, vid, attribute, value, type, interpolate }
    ) {
      let beforeInterpolate = interpolate;
      let afterInterpolate = interpolate;
      if (lastFrame === null) {
        lastFrame = 0;
        beforeInterpolate = InterpolateDiscrete;
      }
      if (nextFrame === null) {
        nextFrame = this.getters["animation/totalFrame"];
        afterInterpolate = InterpolateDiscrete;
      }
      if (!state.map[vid]) {
        Vue.set(state.map, vid, {});
      }
      // 初始轨道的处理
      if (!state.map[vid][attribute]) {
        Vue.set(
          state.map[vid],
          attribute,
          new Array(this.getters["animation/totalFrame"] + 1).fill(null)
        );
      }

      state.map[vid][attribute][frame] = JSON.parse(JSON.stringify(value));
      if (beforeInterpolate !== InterpolateDiscrete) {
        // 关键帧插值处理
        this.commit("preRenderArea/keyframeInterpolation", {
          vid,
          attribute,
          beginFrame: lastFrame,
          endFrame: frame,
          interpolate: beforeInterpolate,
          type,
        });
      }
      if (afterInterpolate !== InterpolateDiscrete) {
        this.commit("preRenderArea/keyframeInterpolation", {
          vid,
          attribute,
          beginFrame: frame,
          endFrame: nextFrame,
          interpolate: afterInterpolate,
          type,
        });
      }

      // 中间缓存帧处理
      this.commit("preRenderArea/clearFrameRangeChache", {
        beginFrame: lastFrame,
        endFrame: nextFrame,
      });
    },

    removeKeyframeChache(state, { frame, vid, attribute }) {},
    keyframeInterpolation(
      state,
      { vid, attribute, beginFrame, endFrame, interpolate, type }
    ) {
      const frameTrack = state.map[vid][attribute];
      const number = endFrame - beginFrame;
      const InterpolateList = Interpolation.get({
        beginValue: frameTrack[beginFrame],
        endValue: frameTrack[endFrame],
        number,
        type,
        interpolate,
      });
      for (let i = 0; i < number; i += 1) {
        frameTrack[beginFrame + i] = InterpolateList[i];
      }
    },
  },
  actions: {
    generateKeyframeChache(
      context,
      { frame, lastFrame, nextFrame, vid, attribute, value, interpolate, type }
    ) {
      context.commit("generateKeyframeChache", {
        frame,
        lastFrame,
        nextFrame,
        vid,
        attribute,
        value,
        interpolate,
        type,
      });
    },
    generateFrameChache(context, frame) {
      context.commit("generateFrameChache", frame);
    },
    previewChache(context, frame) {
      context.commit("previewChache", frame);
    },
  },
};

export { module };
