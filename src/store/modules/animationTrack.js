import { generateConfig } from "@vis-three/middleware";
import { Message } from "element-ui";
import Vue from "vue";

const module = {
  namespaced: true,
  state: {
    map: {
      // ambientLight: {
      //   load: [action],
      //   script: [
      //      {
      //       name: "亮度",
      //       target: object,
      //       attribute: intensity,
      //       pickup: false,
      //       script: {
      //         vid: "",
      //         name: "",
      //       },
      //     },
      //   ],
      //   keyframe: {
      //     intensity: {
      //       name: "亮度",
      //       interpolate: THREE.InterpolateLinear,
      //       type: "number",
      //       keyframe: {
      //         0: 0, // frameNumber: value
      //         13: 1,
      //         60: 2,
      //       },
      //     },
      //   },
      // },
    },
    pickup: false,
  },
  getters: {
    get(state) {
      return state.map;
    },
    currentPickup(state) {
      return state.pickup;
    },
  },
  mutations: {
    init(state, map) {
      state.map = map;
    },

    appendInit(state, map) {
      Object.keys(map).forEach((key) => {
        Vue.set(state.map, key, map[key]);
      });
    },

    add(state, vid) {
      if (!state.map[vid]) {
        Vue.set(state.map, vid, { load: [], script: [], keyframe: {} });
      }
    },

    addActionTrack(state, { object, action }) {
      state.map[object].load.push(action);
    },

    addEventTrack(state, { object, pickup }) {
      state.map[object].script.push({
        name: "",
        target: object,
        attribute: "",
        pickup: false,
        script: {
          vid: "",
          name: "",
        },
      });

      if (pickup) {
        state.pickup =
          state.map[object].script[state.map[object].script.length - 1];
      }
    },

    pickup(state, item) {
      item.pickup = true;
      state.pickup = item;
    },
    registerFrame(state, config) {
      const pickupItem = state.pickup;
      if (pickupItem) {
        if (config.vid !== pickupItem.target) {
          Message.warning("当前拾取的目标对象不一致，请重新拾取。");
          return;
        }
        pickupItem.name = `${config.config.name}`;
        pickupItem.attribute = `.${config.attribute}`;
        pickupItem.pickup = false;
      }
    },

    // add(state, { vid, attribute, config, value }) {
    //   if (!state.map[vid]) {
    //     Vue.set(state.map, vid, {});
    //     this.commit("animation/add", vid);
    //   }
    //   config.keyframe = {};
    //   config.script = {
    //     vid: "",
    //     name: "",
    //   };

    //   const objectPointer = state.map[vid];
    //   Vue.set(objectPointer, attribute, config);

    //   this.commit("animationTrack/addKeyframe", {
    //     vid,
    //     attribute,
    //     value,
    //   });
    // },
    remove(state, { vid, attribute }) {
      Vue.delete(state.map[vid], attribute);
      const attributeList = Object.keys(state.map[vid]);
      if (attributeList.length === 0) {
        Vue.delete(state.map, vid);
        this.commit("animation/remove", vid);
      }
    },

    addKeyframe(state, { vid, attribute, frame, value }) {
      // 注册轨道关键帧
      frame = frame || this.getters["animation/currentFrame"];
      const keyframePointer = state.map[vid][attribute].keyframe;
      Vue.set(keyframePointer, frame, value);
      // 注册缓存关键帧
      this.commit("animationTrack/notifiePreRenderChache", {
        vid,
        attribute,
        frame,
        value,
      });
    },

    removeKeyframe(state, { vid, attribute, frame }) {
      frame = frame || this.getters["animation/currentFrame"];
      const keyframePointer = state.map[vid][attribute].keyframe;
      Vue.delete(keyframePointer, frame);
    },
    setKeyframe(state, { vid, attribute, frame, value }) {
      const keyframePointer = state.map[vid][attribute].keyframe;
      if (keyframePointer[frame] !== undefined) {
        keyframePointer[frame] = value;
        this.commit("animationTrack/notifiePreRenderChache", {
          vid,
          attribute,
          frame,
          value,
        });
      } else {
        this.commit("animationTrack/addKeyframe", {
          vid,
          attribute,
          frame,
          value,
        });
      }
    },
    notifiePreRenderChache(state, { vid, attribute, frame, value }) {
      // 注册缓存关键帧
      const keyframePointer = state.map[vid][attribute].keyframe;
      const keyframeList = Object.keys(keyframePointer).map((keyframe) =>
        Number(keyframe)
      );
      keyframeList.sort((a, b) => a - b);
      let lastFrame = null;
      let nextFrame = null;
      keyframeList.forEach((keyframe, i, arr) => {
        if (keyframe === frame) {
          lastFrame = arr[i - 1] === undefined ? null : arr[i - 1];
          nextFrame = arr[i + 1] === undefined ? null : arr[i + 1];
        }
      });
      const config = state.map[vid][attribute];
      // 异步加帧缓存
      this.dispatch("preRenderArea/generateKeyframeChache", {
        frame,
        lastFrame,
        nextFrame,
        vid,
        attribute,
        value,
        type: config.type,
        interpolate: config.interpolate,
      });
    },
  },
};

export { module };
