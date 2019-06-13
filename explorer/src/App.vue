<template>
  <v-app id="explorer" :dark="isThemeDark">
    <navbar v-if="showNavbar"></navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "./components/Navbar.vue";
import AppFooter from "./components/AppFooter.vue";
import Component from "vue-class-component";

@Component({
  components: { Navbar }
})
export default class App extends Vue {
  get isThemeDark(): boolean {
    return this.$store.getters.isThemeDark;
  }

  get showNavbar(): boolean {
    return this.$store.getters.isOnHomePage;
  }
}
</script>
