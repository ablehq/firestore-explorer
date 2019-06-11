<template>
  <v-app id="explorer" :dark="isThemeDark">
    <navbar></navbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Navbar from "./components/Navbar.vue";
import AppFooter from "./components/AppFooter.vue";

import Component from "vue-class-component";

@Component({
  components: { Navbar, AppFooter },
  computed: {
    ...mapGetters("theme", ["isThemeDark"])
  }
})
export default class App extends Vue {}
</script>
