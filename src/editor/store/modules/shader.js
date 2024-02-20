export const module = {
  namespaced: true,
  state: {
    configuration: {},
  },
  getters: {
    configuration(state) {
      return state.configuration;
    },
  },
  mutations: {
    add(state, { vid, configuration }) {
      state.configuration[vid] = configuration;
    },
  },
  actions: {},
};
