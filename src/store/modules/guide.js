import Vue from "vue";

export const module = {
  namespaced: true,
  state: {
    id: 0, // 组件id计数
    zIndex: 1, // 图层计数
    componentStructureList: {},
    componentList: {}, // canvas中的组件
    currentComponentId: "", // 当前组件的id方便查structure
    currentComponent: "", // 当前选中的组件
    adsorbent: true, // 是否吸附
    colGuideList: [],
    rowGuideList: [],
  },
  getters: {
    // 获取整个组件列表结构
    getComponentStructureList(state) {
      return state.componentStructureList;
    },
    // 获取当前组件
    getCurrentComponent(state) {
      return state.currentComponent;
    },
    // 获取当前组件的id
    getCurrentComponentId(state) {
      return state.currentComponentId;
    },
    // 获取当前组件structure
    getCurrentComponentStructure(state) {
      return state.componentStructureList[state.currentComponentId];
    },
    // 通过id获取组件的结构
    getComponentStructureById(state) {
      return (id) => state.componentStructureList[id];
    },
    // 获取保存的组件结构数据
    getSaveComponentStructureList(state) {
      const saveComponentStructure = [];
      for (const key in state.componentStructureList) {
        const structure = JSON.parse(
          JSON.stringify(state.componentStructureList[key])
        );
        structure.config = "";
        structure.event = "";
        structure.method = "";
        saveComponentStructure.push(structure);
      }
      return saveComponentStructure;
    },
    // 获取吸附状态
    getAdsorbent(state) {
      return state.adsorbent;
    },
    // 获取纵向辅助线的列表
    getColGuideList(state) {
      return state.colGuideList;
    },
    // 获取横向辅辅助线助列
    getRowGuideList(state) {
      return state.rowGuideList;
    },
  },
  mutations: {
    // 添加组件
    addComponent(state, { id, component }) {
      Vue.set(state.componentList, id, component);
    },
    // 添加组件结构
    addComponentStructure(state, { data }) {
      // 初始化
      Vue.set(state.componentStructureList, state.id, {
        name: `${data.name}${state.id}`, // 组件名
        id: state.id, // id标识
        newStatus: true, // 新增状态
        componentType: data.name, // 组件类型
        top: 0,
        left: 0,
        width: data.size.width,
        height: data.size.height,
        opacity: 1, // 不透明度
        rotate: 0, // 旋转
        zIndex: state.zIndex,
        eventList: [], // 运行时事件列表
        configList: {}, // 配置列表
        config: data.config, // 具体组件内部配置
        event: data.event, // 事件
        method: data.method, // 方法
      });
      state.id += 1;
      state.zIndex += 1;
    },
    // 加载组件结构
    loadComponentStructure(state, list) {
      // 先将组件的信息转为对象形式
      const defaultComponentMessageList =
        this.getters.getDefautComponentMessageList;
      const objComponentMessageList = {};
      for (const key in defaultComponentMessageList) {
        if (defaultComponentMessageList[key].children[0]) {
          defaultComponentMessageList[key].children.forEach((elem) => {
            objComponentMessageList[elem.name] = elem;
          });
        }
      }
      // 添加config，event，method并转为对象形式
      const structure = {};
      list.forEach((elem) => {
        elem.newStatus = false;
        elem.config = objComponentMessageList[elem.componentType].config;
        elem.event = objComponentMessageList[elem.componentType].event;
        elem.method = objComponentMessageList[elem.componentType].method;
        structure[elem.id] = elem;
        // 更新 id与zIndex
        if (state.id <= elem.id) {
          state.id = elem.id + 1;
        }
        if (state.zIndex <= elem.zIndex) {
          state.zIndex = elem.zIndex + 1;
        }
      });
      state.componentStructureList = structure;
    },
    // 删除组件
    deleteComponent(state, id) {
      Vue.delete(state.componentList, id);
      Vue.delete(state.componentStructureList, id);
      state.currentComponent = "";
      state.currentComponentId = "";
    },
    // 设置具体组件的大小
    setComponentSize(state, { id, width, height }) {
      state.componentStructureList[id].width = width;
      state.componentStructureList[id].height = height;
    },
    // 设置具体组件的位置
    setComponentPosition(state, { id, top, left }) {
      state.componentStructureList[id].top = top;
      state.componentStructureList[id].left = left;
    },
    // 设置具体组件的旋转
    setComponentRotate(state, { id, rotate }) {
      state.componentStructureList[id].rotate = rotate;
    },
    // 设置当前组件
    setCurrentComponent(state, { component, id }) {
      state.currentComponent = component;
      state.currentComponentId = id;
    },
    // 保存组件的配置
    saveComponentConfigChange(state, { id, name, value }) {
      // 不需要响应式
      state.componentStructureList[id].configList[name] = value;
    },
    // 当前组件添加事件
    currentComponentAddEvent(state, id) {
      state.componentStructureList[id].eventList.push({
        event: "",
        methodList: [],
      });
    },
    // 当前组件添加方法
    currentComponentAddMethod(state, { id, eventIndex, method }) {
      const newMethod = JSON.parse(JSON.stringify(method));
      if (method.params[0]) {
        newMethod.params.forEach((elem) => {
          elem.value = elem.default || "";
        });
      }
      state.componentStructureList[id].eventList[eventIndex].methodList.push(
        newMethod
      );
    },
    // 当前组件注册事件
    currentComponentApplyEvent(state, { id, eventIndex }) {
      debugger;
      // 获取此结构下所有事件
      const event = state.componentStructureList[id].eventList[eventIndex];
      // 由于是组件是匿名函数注册，所以在注册前清空此事件下的列表
      state.currentComponent.clearEventList(event.event);
      event.methodList.forEach((elem) => {
        const saveParams = {};
        // 按顺序注册
        elem.params.forEach((paramElem) => {
          saveParams[paramElem.name] = paramElem.value || paramElem.default;
        });
        state.currentComponent.applyEvent({
          eventName: event.event,
          method: elem.name,
          params: saveParams,
        });
      });
    },
    // 设置吸附状态
    setAdsorbent(state, status) {
      state.adsorbent = status;
    },
    // 添加纵向辅助线
    addColGuide(state, object) {
      state.colGuideList.push(object);
    },
    // 添加横向辅助线
    addRowGuide(state, object) {
      state.rowGuideList.push(object);
    },
  },
  actions: {},
  modules: {},
};
