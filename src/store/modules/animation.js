import Vue from "vue";
import { engine } from "@/assets/js/VisFrame";

const module = {
  namespaced: true,
  state: {
    fps: 30,
    totalDuration: 10, // s
    currentTime: 0,
    totalFrame: 0,
    currentFrame: 0, // 当前帧
    play: false,
    map: {
      // ambientLight: {
      //   duration: 3,
      //   offset: 0,
      //   trackColor: 'rgb(128, 10, 200)',
      //   open: false
      // }
    },
    update: "", // 渲染推进函数
    statisticDelta: 0, // 统计的时间增量
    trackWidth: 0, // px 轨道具体宽度
  },
  getters: {
    map(state) {
      return state.map;
    },
    fps(state) {
      return state.fps;
    },
    totalDuration(state) {
      return state.totalDuration;
    },
    totalFrame(state) {
      return state.totalFrame;
    },
    currentTime(state) {
      return state.currentTime;
    },
    currentFrame(state) {
      return state.currentFrame;
    },
    play(state) {
      return state.play;
    },
    trackWidth(state) {
      return state.trackWidth;
    },
  },
  mutations: {
    add(state, vid) {
      // 获取较高亮度颜色
      const generateTrackColor = () => {
        const colorBase = 65;
        let r = "";
        let g = "";
        let b = "";
        // 先决定固定色值
        const fix = Math.random();
        const coin = Math.random();
        const getRandomColor = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        // 再决定另外2个原色的明暗
        if (fix < 1 / 3) {
          r = colorBase;
          g = coin > 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
          b = coin < 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
        } else if (fix >= 1 / 3 && fix < 2 / 3) {
          g = colorBase;
          r = coin > 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
          b = coin < 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
        } else {
          b = colorBase;
          g = coin > 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
          r = coin < 0.5 ? getRandomColor(180, 250) : getRandomColor(80, 150);
        }
        return `rgb(${r}, ${g}, ${b})`;
      };
      Vue.set(state.map, vid, {
        duration: state.totalDuration,
        offset: 0,
        trackColor: generateTrackColor(),
        open: false,
      });
    },
    remove(state, vid) {
      Vue.delete(state.map, vid);
    },
    // 直接store通知
    change(state, { dargVid, dropVid }) {},
    trackWidth(state, value) {
      state.trackWidth = value;
    },
    totalFrame(state) {
      state.totalFrame = Math.ceil(state.totalDuration * state.fps);
      if (this.getters["preRenderArea/renderEnd"] > state.totalFrame) {
        this.commit("preRenderArea/renderEnd", state.totalFrame);
      }
      this.commit("preRenderArea/generateCacheSignMap");
    },
    fps(state, value) {
      state.fps = value;
      state.totalFrame = Math.ceil(state.totalDuration * value);
      this.commit("animation/totalFrame");
    },
    totalDuration(state, value) {
      state.totalDuration = value;
      state.totalFrame = Math.ceil(state.fps * value);
      this.commit("animation/totalFrame");
    },
    currentFrame(state, value) {
      if (value >= 0 && value <= state.totalFrame) {
        state.currentFrame = value;
        this.dispatch("preRenderArea/previewChache", value);
      }
    },
    play(state, value) {
      if (value) {
        this.commit("animation/currentFrame", state.currentFrame);
        state.update = (delta) => {
          state.statisticDelta += delta;
          if (state.statisticDelta >= 1 / state.fps) {
            let currentFrame =
              state.currentFrame + Math.round(state.statisticDelta * state.fps);
            if (currentFrame > state.totalFrame) {
              currentFrame = 0;
            }
            this.commit("animation/currentFrame", currentFrame);
            state.statisticDelta = 0;
          }
        };
        engine.addEventListener("render", state.update);
      } else {
        engine.removeEventListener("render", state.update);
        state.update = "";
      }
      state.play = value;
    },
    lastFrame(state) {
      this.commit("animation/currentFrame", state.currentFrame - 1);
    },
    nextFrame(state) {
      this.commit("animation/currentFrame", state.currentFrame + 1);
    },
  },
  actions: {},
};

export { module };
