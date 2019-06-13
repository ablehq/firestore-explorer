import { Vue } from "vue-property-decorator";
import Vuex, { Module } from "vuex";
import servers, { ServersState } from "./servers";

import theme, { ThemeState } from "./theme";
import nav, { NavState } from "./nav";
Vue.use(Vuex);

export interface RootState {
  version: string;
  theme: ThemeState;
  servers: ServersState;
  nav: NavState;
}

const store = new Vuex.Store({
  modules: {
    theme,
    servers,
    nav
  }
});

export default store;

// **************************************
// Export all mutation types and payloads from here

import {
  MutationTypes as ThemeMutationTypes,
  Mutation as ThemeMutation
} from "./theme/Mutations";

import {
  MutationTypes as ServersMutationTypes,
  Mutation as ServersMutation
} from "./servers/Mutations";

import {
  MutationTypes as NavMutationTypes,
  Mutation as NavMutation
} from "./nav/Mutations";

export type Mutation = ThemeMutation | ServersMutation | NavMutation;
export const MutationTypes = {
  ...ThemeMutationTypes,
  ...ServersMutationTypes,
  ...NavMutationTypes
};
// End mutation payloads
// **************************************

// **************************************
// Export all action payloads from here

import {
  ActionTypes as ThemeActionTypes,
  Action as ThemeAction
} from "./theme/Actions";

import {
  ActionTypes as ServerActionTypes,
  Action as ServerAction
} from "./servers/Actions";

import {
  ActionTypes as NavActionTypes,
  Action as NavAction
} from "./nav/Actions";

export type Action = ThemeAction | ServerAction | NavAction;
export const ActionTypes = {
  ...ThemeActionTypes,
  ...ServerActionTypes,
  ...NavActionTypes
};
// End action payloads
// **************************************
