import Vue from "vue";
import Router, { Route } from "vue-router";
import Home from "./views/Home.vue";
import store, { Action, ActionTypes } from "./stores/index";
import CreateServer from "./views/CreateServer.vue";

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
      component: CreateServer
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
