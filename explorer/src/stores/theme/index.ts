import { ThemeState } from "./State";
import { Module } from "vuex";
import { RootState } from "..";
import { getters } from "./Getters";
import { mutations } from "./Mutations";
import { actions } from "./Actions";
const themeStore: Module<ThemeState, RootState> = {
  state: {
    mode: "light"
  },
  getters,
  mutations,
  actions
};

export default themeStore;
export { ThemeState };
