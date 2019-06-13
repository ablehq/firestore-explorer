import { MutationPayload, MutationTree } from "vuex";
import { NavState } from "./State";

export enum MutationTypes {
  SetOnHomePage = "SetOnHomePage"
}

export interface SetOnHomePageMutation extends MutationPayload {
  type: MutationTypes.SetOnHomePage;
  payload: {
    isOnHomePage: boolean;
  };
}

export const mutations: MutationTree<NavState> = {
  [MutationTypes.SetOnHomePage](state, { payload }: SetOnHomePageMutation) {
    state.isOnHomePage = payload.isOnHomePage;
  }
};

export type Mutation = SetOnHomePageMutation;
