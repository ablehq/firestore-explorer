import { ActionPayload, ActionTree } from "vuex";
import { ServersState, Server } from "./State";
import { RootState, MutationTypes, Mutation } from "..";
import apiServer from "../ApiServer";
export enum ActionTypes {
  FetchServers = "FetchServers",
  AddNewServer = "AddNewServer",
  DeleteServer = "DeleteServer"
}

export interface AddNewServerAction extends ActionPayload {
  type: ActionTypes.AddNewServer;
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
      const server: Server = await apiServer
        .post("/servers", rest)
        .then(resp => resp.data);
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
  async [ActionTypes.FetchServers](context) {
    try {
      const servers: Array<Server> = await apiServer
        .get("/servers")
        .then(resp => resp.data);
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
      await apiServer
        .delete(`/servers/${payload.serverId}`)
        .then(resp => resp.data);
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
  | FetchServersAction;
