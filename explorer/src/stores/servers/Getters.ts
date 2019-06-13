import { GetterTree } from "vuex";

import { ServersState, Server } from "./State";

import { RootState } from "..";

export const getters: GetterTree<ServersState, RootState> = {
  servers(state: ServersState): Array<Server> {
    return state.servers;
  }
};
