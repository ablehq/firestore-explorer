import { MutationPayload, MutationTree } from "vuex";
import { ThemeState } from "./State";

export enum MutationTypes {
  SetTheme = "SetTheme"
}

export interface SetThemeMutation extends MutationPayload {
  type: MutationTypes.SetTheme;
  payload: {
    darkModeOn: boolean;
  };
}

export const mutations: MutationTree<ThemeState> = {
  [MutationTypes.SetTheme](state, { payload }: SetThemeMutation) {
    if (payload.darkModeOn) {
      state.mode = "dark";
    } else {
      state.mode = "light";
    }
  }
};

export type Mutation = SetThemeMutation;
