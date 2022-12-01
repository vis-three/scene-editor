export const module = {
  namespaced: true,
  state: {
    object: "",
    material: "",
    texture: "",
    geometry: "",
    pass: "",
  },
  getters: {
    object(state) {
      return state.object;
    },

    geometry(state) {
      return state.geometry;
    },

    material(state) {
      return state.material;
    },

    texture(state) {
      return state.texture;
    },

    pass(state) {
      return state.pass;
    },
  },
  mutations: {
    object(state, object) {
      state.object = object;

      if (object.geometry) {
        state.geometry = this.getters["geometry/get"][object.geometry];
      } else {
        state.geometry = "";
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          state.material = this.getters["material/get"][object.material[0]];
        } else {
          state.material = this.getters["material/get"][object.material];
        }
      } else {
        state.material = "";
      }
    },

    material(state, material) {
      state.material = material;
    },

    pass(state, pass) {
      state.pass = pass;
    },

    clear(state) {
      state.object = "";
      state.material = "";
    },
  },
  actions: {},
};
