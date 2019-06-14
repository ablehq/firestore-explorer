import { MutationPayload, MutationTree } from "vuex";
import { ServersState, Server } from "./State";

export enum MutationTypes {
  AddNewServer = "AddNewServer",
  DeleteServer = "DeleteServer",
  SetServers = "SetServers",
  EditServer = "EditServer"
}

export interface AddServerMutation extends MutationPayload {
  type: MutationTypes.AddNewServer;
  payload: Server;
}

export interface DeleteServerMutation extends MutationPayload {
  type: MutationTypes.DeleteServer;
  payload: {
    serverId: string;
  };
}

export interface SetServersMutation extends MutationPayload {
  type: MutationTypes.SetServers;
  payload: Array<Server>;
}

export interface EditServerMutation extends MutationPayload {
  type: MutationTypes.EditServer;
  payload: Server;
}

export const mutations: MutationTree<ServersState> = {
  [MutationTypes.AddNewServer](state, { payload }: AddServerMutation) {
    state.servers = [payload].concat(state.servers);
  },
  [MutationTypes.SetServers](state, { payload }: SetServersMutation) {
    state.servers = payload;
  },
  [MutationTypes.DeleteServer](state, { payload }: DeleteServerMutation) {
    state.servers = state.servers.filter(
      (server: Server) => server.id !== payload.serverId
    );
  },
  [MutationTypes.EditServer](state, { payload }: EditServerMutation) {
    const index = state.servers.findIndex(
      (server: Server) => server.id === payload.id
    );
    if (index >= 0) {
      state.servers.splice(index, 0, payload);
    }
  }
};

export type Mutation =
  | AddServerMutation
  | DeleteServerMutation
  | SetServersMutation
  | EditServerMutation;
