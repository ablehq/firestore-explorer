import { MutationPayload, MutationTree } from "vuex";
import { ServersState, Server } from "./State";

export enum MutationTypes {
  AddNewServer = "AddNewServer",
  DeleteServer = "DeleteServer"
}

export interface AddServerMutation extends MutationPayload {
  type: MutationTypes.AddNewServer;
  payload: Server;
}

export interface DeleteServerMutation extends MutationPayload {
  type: MutationTypes.DeleteServer;
  payload: {
    serverName: string;
  };
}

export const mutations: MutationTree<ServersState> = {
  [MutationTypes.AddNewServer](state, { payload }: AddServerMutation) {
    state.servers = [payload].concat(state.servers);
  },
  [MutationTypes.DeleteServer](state, { payload }: DeleteServerMutation) {
    state.servers = state.servers.filter(
      (server: Server) => server.name !== payload.serverName
    );
  }
};

export type Mutation = AddServerMutation | DeleteServerMutation;
