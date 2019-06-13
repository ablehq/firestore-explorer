import { NavState } from "./State";
import { Module } from "vuex";
import { RootState } from "..";
import { getters } from "./Getters";
import { mutations } from "./Mutations";
import { actions } from "./Actions";

const themeStore: Module<NavState, RootState> = {
  state: {
    isOnHomePage: true
  },
  getters,
  mutations,
  actions
};

export default themeStore;
export { NavState };
