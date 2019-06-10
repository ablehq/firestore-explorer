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
      <v-spacer></v-spacer>
      <v-btn flat color="grey">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer">
      <p>test</p>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Navbar extends Vue {
  drawer: Boolean = false;
}
</script>

<style scoped></style>
