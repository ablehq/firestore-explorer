import { ActionPayload, ActionTree } from "vuex";
import { ServersState, Server } from "./State";
import { RootState, MutationTypes, Mutation } from "..";
import {
  addNewServer,
  fetchAllServers,
  updateServer,
  deleteServer
} from "../../db";
export enum ActionTypes {
  FetchServers = "FetchServers",
  AddNewServer = "AddNewServer",
  DeleteServer = "DeleteServer",
  EditServer = "EditServer"
}

export interface AddNewServerAction extends ActionPayload {
  type: ActionTypes.AddNewServer;
  payload: Server;
}

export interface EditServerAction extends ActionPayload {
  type: ActionTypes.EditServer;
  payload: Server;
}

export interface FetchServersAction extends ActionPayload {
  type: ActionTypes.FetchServers;
}

export interface DeleteServerAction extends ActionPayload {
  type: ActionTypes.DeleteServer;
  payload: {
    serverId: string;
  };
}

export const actions: ActionTree<ServersState, RootState> = {
  async [ActionTypes.AddNewServer](
    context,
    { payload: { id, ...rest } }: AddNewServerAction
  ) {
    try {
      const server: Server = addNewServer(rest);
      console.log(`Server is ${server}`);
      context.commit<Mutation>({
        type: MutationTypes.AddNewServer,
        payload: server
      });
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        error: e
      };
    }
  },
  async [ActionTypes.EditServer](
    context,
    { payload: server }: EditServerAction
  ) {
    try {
      const updatedServer: Server = updateServer(server);
      context.commit<Mutation>({
        type: MutationTypes.EditServer,
        payload: updatedServer
      });
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        error: e
      };
    }
  },
  async [ActionTypes.FetchServers](context) {
    try {
      const servers: Array<Server> = fetchAllServers();
      context.commit<Mutation>({
        type: MutationTypes.SetServers,
        payload: servers
      });
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        error: e
      };
    }
  },
  async [ActionTypes.DeleteServer](context, { payload }: DeleteServerAction) {
    try {
      deleteServer(payload.serverId);
      context.commit<Mutation>({
        type: MutationTypes.DeleteServer,
        payload
      });
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        error: e
      };
    }
  }
};

export type Action =
  | AddNewServerAction
  | DeleteServerAction
  | FetchServersAction
  | EditServerAction;
