import { GetterTree } from "vuex";

import { NavState } from "./State";

import { RootState } from "..";

export const getters: GetterTree<NavState, RootState> = {
  isOnHomePage(state: NavState): boolean {
    return state.isOnHomePage;
  }
};
