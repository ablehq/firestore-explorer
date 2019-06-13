import { ServersState } from "./State";
import { Module } from "vuex";
import { RootState } from "..";
import { getters } from "./Getters";
import { mutations } from "./Mutations";
import { actions } from "./Actions";

const store: Module<ServersState, RootState> = {
  state: {
    servers: []
  },
  getters,
  mutations,
  actions
};

export default store;
export { ServersState };
