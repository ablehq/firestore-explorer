import Vue from "vue";
import Router, { Route } from "vue-router";
import Home from "./views/Home.vue";
import store, { Action, ActionTypes } from "./stores/index";
import ServerForm from "./views/ServerForm.vue";
import ExploreServer from "./views/ExploreServer.vue";
import ListRootCollections from "./views/ListRootCollections.vue";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/servers/new",
      name: "new-server",
      component: ServerForm
    },
    {
      path: "/servers/edit/:serverId",
      name: "edit-server",
      props: true,
      component: ServerForm
    },
    {
      path: "/servers/explore/:serverId",
      name: "explore-server",
      props: true,
      component: ExploreServer
    },
    {
      path: "/servers/roots/:serverId",
      name: "list-root-collections",
      props: true,
      component: ListRootCollections
    }
  ]
});

router.afterEach((to: Route) => {
  store.dispatch<Action>({
    type: ActionTypes.SetOnHomePage,
    payload: {
      isOnHomePage: to.name === "home"
    }
  });
});

export default router;
