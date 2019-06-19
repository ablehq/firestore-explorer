import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./stores";
import "./registerServiceWorker";
import "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json.min.js";
import Prism from "prismjs";
Prism.highlightAll();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
