import { GetterTree } from "vuex";

import { ThemeState } from "./State";

import { RootState } from "..";

export const getters: GetterTree<ThemeState, RootState> = {
  isThemeDark(state: ThemeState): boolean {
    return state.mode == "dark";
  }
};
