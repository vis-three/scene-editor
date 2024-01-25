export const module = {
  namespaced: true,
  state: {
    map: {},
    configuration: {},
    draggedComponentItem: "",
    dragging: false,
  },
  getters: {
    get(state) {
      return state.map;
    },
    configuration(state) {
      return state.configuration;
    },
    dragging(state) {
      return state.dragging;
    },
    draggedComponentItem(state) {
      return state.draggedComponentItem;
    },
  },
  mutations: {
    dragging(state, status) {
      state.dragging = status;
    },
    draggedComponentItem(state, item) {
      state.draggedComponentItem = item;
    },

    add(state, { config, configuration }) {
      state.map[config.$cid] = config;
      state.configuration[config.$cid] = configuration;
    },
  },
  actions: {},
};
