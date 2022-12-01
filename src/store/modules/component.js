export const module = {
  namespaced: true,
  state: {
    map: {},
    configuration: {},
  },
  getters: {
    get(state) {
      return state.map;
    },
    configuration(state) {
      return state.configuration;
    },
  },
  mutations: {
    add(state, { config, configuration }) {
      state.map[config.$cid] = config;
      state.configuration[config.$cid] = configuration;
    },
  },
  actions: {},
};
