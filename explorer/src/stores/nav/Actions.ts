import { ActionPayload, ActionTree } from "vuex";
import { NavState } from "./State";
import { RootState, MutationTypes, Mutation } from "..";

export enum ActionTypes {
  SetOnHomePage = "SetOnHomePage"
}

export interface SetOnHomePageAction extends ActionPayload {
  type: ActionTypes.SetOnHomePage;
  payload: {
    isOnHomePage: boolean;
  };
}

export const actions: ActionTree<NavState, RootState> = {
  [ActionTypes.SetOnHomePage](context, { payload }: SetOnHomePageAction) {
    context.commit<Mutation>({
      type: MutationTypes.SetOnHomePage,
      payload
    });
  }
};

export type Action = SetOnHomePageAction;
