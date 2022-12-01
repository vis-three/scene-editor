import axios from "@/assets/js/plugins/axios";

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
    selected: "", // 选中列表
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
    selected(state) {
      return state.selected;
    },
  },
  mutations: {
    request(state, classifyId) {
      state.loading = true;
      axios({
        method: "post",
        url: "/app/structure",
        data: {
          classifyId,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const data = res.data;

            data.forEach((file) => {
              file.parent = state.currentFloder;
              file.select = false;
              if (file.dir) {
                file.children = [];
                file.loaded = false;
              }
            });

            state.currentFloder.children = data;
          }
        })
        .finally(() => {
          state.loading = false;
        });
    },
    currentFloder(state, file) {
      if (file.dir && !file.loaded) {
        file.loaded = true;
        this.commit("appLibrary/request", file.id);
      }

      state.currentFloder = file;
      this.commit("appLibrary/addHistory", file);
    },
    addHistory(state, file) {
      // 指针在中间，splice去掉后面的
      if (state.historyPointer !== state.history.length - 1) {
        state.history.splice(
          state.historyPointer + 1,
          state.history.length - 1
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
    cancelSelected(state) {
      state.selected = "";
    },
    select(state, file) {
      state.selected = file;
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
        1
      );
    },
  },
  actions: {},
};
