import { ActionPayload, ActionTree } from "vuex";
import { ThemeState } from "./State";
import { RootState, MutationTypes, Mutation } from "..";
import { setDarkMode, isThemeDark } from "../../db";
export enum ActionTypes {
  SetTheme = "SetTheme",
  GetTheme = "GetTheme"
}

export interface SetThemeAction extends ActionPayload {
  type: ActionTypes.SetTheme;
  payload: {
    darkModeOn: boolean;
  };
}

export interface GetThemeAction extends ActionPayload {
  type: ActionTypes.GetTheme;
  payload: {};
}

export const actions: ActionTree<ThemeState, RootState> = {
  async [ActionTypes.SetTheme](context, { payload }: SetThemeAction) {
    await setDarkMode(payload.darkModeOn);
    context.commit<Mutation>({
      type: MutationTypes.SetTheme,
      payload
    });
  },
  async [ActionTypes.GetTheme](context, { payload }: GetThemeAction) {
    const isDark: boolean = await isThemeDark();
    context.commit<Mutation>({
      type: MutationTypes.SetTheme,
      payload: {
        darkModeOn: isDark
      }
    });
  }
};

export type Action = SetThemeAction | GetThemeAction;
