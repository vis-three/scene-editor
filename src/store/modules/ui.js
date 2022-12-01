import Vue from "vue";

export const getAdsorbentPoint = (position, size) => {
  return {
    xStart: position.x,
    xCenter: position.x + Math.ceil(size.width / 2),
    xEnd: position.x + size.width,
    yStart: position.y,
    yCenter: position.y + Math.ceil(size.height / 2),
    yEnd: position.y + size.height
  };
};

export const module = {
  namespaced: true,
  state: {
    // UI层尺寸
    size: {
      width: 1920,
      height: 1080
    },
    zoom: 1, // UI层缩放
    adsorbent: true, // 是否开启吸附
    adsorbDistance: 5, // 吸附距离
    scene: [],
    // UI层的结构
    structure: {
      three: {
        uid: "three",
        name: "3D组件",
        position: {
          x: 0,
          y: 0
        },
        size: {
          width: 1920,
          height: 1080
        },
        cid: "three",
        zIndex: 0
      }
      // uid: {
      //   name:
      //   uid:
      //   position:
      //   size::
      //   cid::
      // }
    },
    // 吸附缓存X
    adsorbXMap: {
      // 0: [{uid, key, position}]
    },
    // 吸附缓存y
    adsorbYMap: {
      // 0: []
    },
    adsorbStructure: {
      // 组件吸附结构
      // uid: {
      //   xStart: position.x,
      //   xCenter: Math.ceil(size.width / 2),
      //   xEnd: size.width,
      //   yStart: position.y,
      //   yCenter: Math.ceil(size.height / 2),
      //   yEnd: size.height
      // }
    },
    // 距离辅助线列表
    distanceHelpers: [
      // {start: {x: 0, y: 0}, end: {x: 0, y: 0}, distance: 0}
    ],
    editing: false // 是否处于组件编辑状态
  },
  getters: {
    size(state) {
      return state.size;
    },
    zoom(state) {
      return state.zoom;
    },
    structure(state) {
      return state.structure;
    },
    structureList(state) {
      return Object.values(state.structure);
    },
    get(state) {
      return state.structure;
    },
    distanceHelpers(state) {
      return state.distanceHelpers;
    },
    adsorbent(state) {
      return state.adsorbent;
    },
    editing(state) {
      return state.editing;
    },
    // 获取吸附偏移量
    adsorbOffset(state, getters, rootState, rootGetters) {
      return (position, size) => {
        if (!state.adsorbent) {
          return { x: 0, y: 0 };
        }

        const boxMap = getAdsorbentPoint(position, size);
        const distance = state.adsorbDistance;
        const adsorbXMap = state.adsorbXMap;
        const adsorbYMap = state.adsorbYMap;
        const colGuideMap = rootGetters["guide/colGuideMap"];
        const rowGuideMap = rootGetters["guide/rowGuideMap"];
        const guideDisplay = rootGetters["guide/display"];

        let offsetX = null;
        let offsetY = null;

        for (let offset = 1; offset <= distance; offset += 1) {
          // 求6个点的最小偏移量
          for (const key in boxMap) {
            if (offsetX === null && key.startsWith("x")) {
              if (
                adsorbXMap[boxMap[key] + offset] ||
                (guideDisplay && colGuideMap[boxMap[key] + offset])
              ) {
                offsetX = offset;
              } else if (
                adsorbXMap[boxMap[key] - offset] ||
                (guideDisplay && colGuideMap[boxMap[key] - offset])
              ) {
                offsetX = -offset;
              }
            }

            if (offsetY === null && key.startsWith("y")) {
              if (
                adsorbYMap[boxMap[key] + offset] ||
                (guideDisplay && rowGuideMap[boxMap[key] + offset])
              ) {
                offsetY = offset;
              } else if (
                adsorbYMap[boxMap[key] - offset] ||
                (guideDisplay && rowGuideMap[boxMap[key] - offset])
              ) {
                offsetY = -offset;
              }
            }
          }

          if (offsetX && offsetY) {
            break;
          }
        }

        return {
          x: offsetX || 0,
          y: offsetY || 0
        };
      };
    }
  },
  mutations: {
    zoom(state, value) {
      state.zoom = value;
    },
    add(state, config) {
      Vue.set(state.structure, config.uid, config);
      this.commit("ui/updateAdsorbentCache", config.uid);
    },
    remove(state, uid) {
      Vue.delete(state.structure, uid);
      this.commit("ui/removeAdsorbentCache", uid);
    },

    adsorbent(state, value) {
      state.adsorbent = value;
    },

    editing(state, value) {
      state.editing = value;
    },

    // ui整体初始化
    init(state, structure) {
      state.structure = structure;
      this.commit("ui/updateAdsorbentCache", "scene");

      // 组件6个点
      for (const uid in state.structure) {
        this.commit("ui/updateAdsorbentCache", uid);
      }
      // TODO: 辅助线
      console.log(state.adsorbStructure, state.adsorbXMap, state.adsorbYMap);
    },

    // 更新单个ui的吸附
    updateAdsorbentCache(state, uid) {
      const adsorbStructure = state.adsorbStructure;
      const adsorbXMap = state.adsorbXMap;
      const adsorbYMap = state.adsorbYMap;

      const updateCacheMap = (sign, map, uid, position) => {
        const keyList = [`${sign}Start`, `${sign}Center`, `${sign}End`];
        let cacheMap = sign === "x" ? adsorbXMap : adsorbYMap;
        for (const key of keyList) {
          const list = cacheMap[map[key]];
          const elem = { uid, key, position };
          if (list) {
            if (!list.find(elem => elem.uid === uid)) {
              cacheMap[map[key]].push(elem);
            }
          } else {
            cacheMap[map[key]] = [elem];
          }
        }
      };

      let position = {};
      let size = {};

      if (uid === "scene") {
        position = { x: 0, y: 0 };
        size = this.getters["ui/size"];
      } else {
        const structure = this.getters["ui/structure"][uid];
        position = structure.position;
        size = structure.size;
      }

      const map = getAdsorbentPoint(position, size);
      adsorbStructure[uid] = map;

      updateCacheMap("x", map, uid, position);
      updateCacheMap("y", map, uid, position);
    },

    // 清楚单个ui的吸附缓存
    removeAdsorbentCache(state, uid) {
      const map = state.adsorbStructure[uid];
      const adsorbXMap = state.adsorbXMap;
      const adsorbYMap = state.adsorbYMap;
      Vue.delete(state.adsorbStructure, uid);

      for (const key in map) {
        if (key.startsWith("x") && adsorbXMap[map[key]]) {
          adsorbXMap[map[key]].some((elem, i, arr) => {
            if (elem.uid === uid) {
              arr.splice(i, 1);
              if (!arr.length) {
                delete adsorbXMap[map[key]];
              }
              return true;
            }
          });
        } else if (key.startsWith("y") && adsorbYMap[map[key]]) {
          adsorbYMap[map[key]].some((elem, i, arr) => {
            if (elem.uid === uid) {
              arr.splice(i, 1);
              if (!arr.length) {
                delete adsorbYMap[map[key]];
              }
              return true;
            }
          });
        }
      }
    },

    // 根据uid组件更新相关的距离辅助线
    updateDistanceHelper(state, uid) {
      const structure = state.structure[uid];
      const map = getAdsorbentPoint(structure.position, structure.size);
      const adsorbStructure = state.adsorbStructure;
      const adsorbXMap = state.adsorbXMap;
      const adsorbYMap = state.adsorbYMap;

      state.distanceHelpers = [];

      const distanceHelpers = state.distanceHelpers;

      // 获取最小距离对象
      const minDistanceObject = (list, sign) => {
        list = list.map(elem => {
          return {
            ...elem,
            distance: structure.position[sign] - elem.position[sign]
          };
        });

        const minDistance = Math.min(
          ...list.map(elem => Math.abs(elem.distance))
        );

        return list.find(elem => Math.abs(elem.distance) === minDistance);
      };

      const distanceBox = {};
      // 找出6个点的对应数组
      // 每个数组找到最小的距离对象
      for (const key in map) {
        if (key.startsWith("x") && adsorbXMap[map[key]]) {
          distanceBox[key] = minDistanceObject(adsorbXMap[map[key]], "y");
        } else if (key.startsWith("y") && adsorbYMap[map[key]]) {
          distanceBox[key] = minDistanceObject(adsorbYMap[map[key]], "x");
        }
      }

      // 遍历更新distanceHelper 形成2个组件的距离辅助
      for (const key in distanceBox) {
        const targetElem = distanceBox[key];
        const targetAbsorbMap = adsorbStructure[targetElem.uid];
        if (key.startsWith("x")) {
          distanceHelpers.push({
            start: {
              x: targetAbsorbMap[targetElem.key],
              y:
                targetElem.distance > 0
                  ? targetAbsorbMap.yEnd
                  : targetAbsorbMap.yStart
            },
            end: {
              x: map[key],
              y: targetElem.distance > 0 ? map.yStart : map.yEnd
            },
            distance: Math.abs(targetElem.distance)
          });
        } else {
          distanceHelpers.push({
            start: {
              x:
                targetElem.distance > 0
                  ? targetAbsorbMap.xEnd
                  : targetAbsorbMap.xStart,
              y: targetAbsorbMap[targetElem.key]
            },
            end: {
              x: targetElem.distance > 0 ? map.xStart : map.xEnd,
              y: map[key]
            },
            distance: Math.abs(targetElem.distance)
          });
        }
      }
    },

    // 情况距离辅助线
    clearDistanceHelper(state) {
      state.distanceHelpers = [];
    }
  },
  modules: {}
};
