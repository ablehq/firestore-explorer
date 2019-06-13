<template>
  <nav>
    <v-toolbar flat app color="transparent">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light"></span>
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
