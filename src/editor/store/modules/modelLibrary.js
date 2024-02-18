import modelApi from "@/assets/js/api/model.js";
import { Message } from "element-ui";

const fileTree = {
  dir: true,
  name: "/",
  parent: null,
  children: [],
};

export const module = {
  namespaced: true,
  state: {
    loading: false, // 加载标识
    fileTree: fileTree, // 文件树
    currentFloder: fileTree, // 当前文件夹
    selectMap: new Map(), // 选中列表
    history: [fileTree], // 历史记录
    historyPointer: "", // 历史指针
    multiple: false, // 是否多选
    currentSelect: "", // 当前选中
    cache: 10, // 缓存历史数量
  },
  getters: {
    fileTree(state) {
      return state.fileTree;
    },
    currentFloder(state) {
      return state.currentFloder;
    },
    currentSelect(state) {
      return state.currentSelect;
    },
    show(state) {
      return state.show;
    },
    loading(state) {
      return state.loading;
    },
  },
  mutations: {
    request(state, classifyId) {
      state.loading = true;
      modelApi
        .getStructure(classifyId || 0)
        .then((data) => {
          data.forEach((file) => {
            file.parent = state.currentFloder;
            file.select = false;
            if (file.dir) {
              file.children = [];
              file.loaded = false;
            }
          });

          state.currentFloder.children = data;
        })
        .catch((err) => {
          Message.error("model数据库有误：" + err);
        })
        .finally(() => {
          state.loading = false;
        });
    },
    currentFloder(state, file) {
      if (file.dir && !file.loaded) {
        file.loaded = true;
        this.commit("modelLibrary/request", file.id);
      }

      state.currentFloder = file;
      this.commit("modelLibrary/addHistory", file);
    },
    addHistory(state, file) {
      // 指针在中间，splice去掉后面的
      if (state.historyPointer !== state.history.length - 1) {
        state.history.splice(
          state.historyPointer + 1,
          state.history.length - 1,
        );
      } else {
        // 判断最大缓存
        if (state.history.length >= state.cache) {
          state.history.shift();
        }
      }
      state.history.push(file);
      state.historyPointer = state.history.length - 1;
    },
    select(state, file) {
      if (state.selectType.includes(file.type) || !state.selectType.length) {
        state.selected(file, { role: state.role, type: state.type });
        file.select = !file.select;
        if (file.select) {
          if (!state.multiple) {
            state.selectMap.forEach((value, key) => {
              key.select = false;
            });
            state.selectMap.clear();
          }
          state.selectMap.set(file, true);
          state.currentSelect = file;
        } else {
          state.selectMap.has(file) && state.selectMap.delete(file);
        }
      }
    },
    backOffHistory(state) {
      state.historyPointer -= 1;
      if (state.historyPointer < 0) {
        state.historyPointer = 0;
        return false;
      }

      state.currentFloder = state.history[state.historyPointer];
    },
    forwardHistory(state) {
      state.historyPointer += 1;
      if (state.historyPointer > state.history.length - 1) {
        state.historyPointer = state.history.length - 1;
        return false;
      }

      state.currentFloder = state.history[state.historyPointer];
    },
    multiple(state, status) {
      state.multiple = status;
    },
    addChildren(state, file) {
      file.children = [];
      file.select = false;
      file.parent = state.currentFloder;
      state.currentFloder.children.push(file);
    },
    removeChildren(state, file) {
      state.currentFloder.children.splice(
        state.currentFloder.children.indexOf(file),
        1,
      );
    },
  },
  actions: {},
};
