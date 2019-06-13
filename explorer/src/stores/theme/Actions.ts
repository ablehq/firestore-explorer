import { ActionPayload, ActionTree } from "vuex";
import { ThemeState } from "./State";
import { RootState, MutationTypes, Mutation } from "..";

export enum ActionTypes {
  SetTheme = "SetTheme"
}

export interface SetThemeAction extends ActionPayload {
  type: ActionTypes.SetTheme;
  payload: {
    darkModeOn: boolean;
  };
}

export const actions: ActionTree<ThemeState, RootState> = {
  [ActionTypes.SetTheme](context, { payload }: SetThemeAction) {
    context.commit<Mutation>({
      type: MutationTypes.SetTheme,
      payload
    });
  }
};

export type Action = SetThemeAction;
