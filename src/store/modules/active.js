export const module = {
  namespaced: true,
  state: {
    object: "",
    material: "",
    texture: "",
    geometry: "",
    pass: "",
    functionModuleMap: {},
    functionModule: 0,
    disable: false,
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
    functionModule(state) {
      return state.functionModule;
    },
    disable(state) {
      return state.disable;
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

      this.commit("active/functionModule", "object");
    },

    material(state, material) {
      state.material = material;
    },

    texture(state, texture) {
      state.texture = texture;
    },

    pass(state, pass) {
      state.pass = pass;
    },

    clear(state) {
      state.object = "";
      state.material = "";
    },

    initFunctionModules(state, modules) {
      modules.forEach((module, i) => {
        state.functionModuleMap[module] = i;
      });
    },

    functionModule(state, module) {
      if (typeof state.functionModuleMap[module] !== undefined) {
        state.functionModule = state.functionModuleMap[module];
      } else {
        console.warn(`can not set module: ${module}`);
      }
    },

    disable(state, status) {
      state.disable = status;
    },
  },
  actions: {},
};
