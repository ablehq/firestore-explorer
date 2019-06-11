<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon
        @click="drawer = !drawer"
        class="grey--text"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Explorer</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer">
      <sidebar></sidebar>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sidebar from "./Sidebar.vue";

@Component({
  components: { Sidebar }
})
export default class Navbar extends Vue {
  drawer: Boolean = false;
}
</script>

<style scoped></style>
