import Vue from "vue";
import Router, { Route } from "vue-router";
import Home from "./views/Home.vue";
import store, { Action, ActionTypes } from "./stores/index";
import ServerForm from "./views/ServerForm.vue";
import ExploreServer from "./views/ExploreServer.vue";
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
