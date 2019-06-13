import { ActionPayload, ActionTree } from "vuex";
import { ServersState, Server } from "./State";
import { RootState, MutationTypes, Mutation } from "..";

export enum ActionTypes {
  AddNewServer = "AddNewServer",
  DeleteServer = "DeleteServer"
}

export interface AddNewServerAction extends ActionPayload {
  type: ActionTypes.AddNewServer;
  payload: Server;
}

export interface DeleteServerAction extends ActionPayload {
  type: ActionTypes.DeleteServer;
  payload: {
    serverName: string;
  };
}

export const actions: ActionTree<ServersState, RootState> = {
  [ActionTypes.AddNewServer](context, { payload }: AddNewServerAction) {
    context.commit<Mutation>({
      type: MutationTypes.AddNewServer,
      payload
    });
  },
  [ActionTypes.DeleteServer](context, { payload }: DeleteServerAction) {
    context.commit<Mutation>({
      type: MutationTypes.DeleteServer,
      payload
    });
  }
};

export type Action = AddNewServerAction | DeleteServerAction;
