import { history } from "@/assets/js/vis";

export const module = {
  namespaced: true,
  state: {
    redoStatus: false,
    undoStatus: false,
  },
  getters: {
    redoStatus(state) {
      return state.redoStatus;
    },
    undoStatus(state) {
      return state.undoStatus;
    },
  },
  mutations: {
    redo(state) {
      history.redo();
    },
    undo(state) {
      history.undo();
    },

    redoStatus(state, status) {
      state.redoStatus = status;
    },
    undoStatus(state, status) {
      state.undoStatus = status;
    },
  },
  actions: {},
};
