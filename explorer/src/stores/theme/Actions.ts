import { ActionPayload, ActionTree } from "vuex";
import { ThemeState } from "./State";
import { RootState, MutationTypes, Mutation } from "..";
import { setDarkMode } from "../../db";
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
    setDarkMode(payload.darkModeOn);
    context.commit<Mutation>({
      type: MutationTypes.SetTheme,
      payload
    });
  }
};

export type Action = SetThemeAction;
