import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "../models/states";
import { theme } from "./ThemeStore";

Vue.use(Vuex);

const storeOptions: StoreOptions<RootState> = {
  modules: {
    theme: theme
  }
};

export default new Vuex.Store<RootState>(storeOptions);
