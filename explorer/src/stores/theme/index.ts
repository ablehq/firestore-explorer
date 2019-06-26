import { ThemeState } from "./State";
import { Module } from "vuex";
import { RootState } from "..";
import { getters } from "./Getters";
import { mutations } from "./Mutations";
import { actions } from "./Actions";
import { isThemeDark } from "../../db";
const themeStore: Module<ThemeState, RootState> = {
  state: {
    mode: isThemeDark() ? "dark" : "light"
  },
  getters,
  mutations,
  actions
};

export default themeStore;
export { ThemeState };
