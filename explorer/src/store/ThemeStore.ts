import { ThemeState, RootState } from "@/models/states";
import {
  Module,
  GetterTree,
  ActionTree,
  MutationTree,
  ActionContext
} from "vuex";

const namespaced: boolean = true;
export const state: ThemeState = {
  mode: "light"
};
export const getters: GetterTree<ThemeState, RootState> = {
  isThemeDark(state: ThemeState): boolean {
    return state.mode == "dark";
  }
};
export const actions: ActionTree<ThemeState, RootState> = {
  setDarkMode(
    store: ActionContext<ThemeState, RootState>,
    darkModeOn: boolean
  ) {
    store.commit("SET_DARK_MODE", darkModeOn);
  }
};

export const mutations: MutationTree<ThemeState> = {
  SET_DARK_MODE(state: ThemeState, darkModeOn: boolean) {
    if (darkModeOn) {
      state.mode = "dark";
    } else {
      state.mode = "light";
    }
  }
};

export const theme: Module<ThemeState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
