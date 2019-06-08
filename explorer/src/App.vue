<template>
  <v-app id="explorer" dark>
    <v-navigation-drawer v-model="primaryDrawer.model" absolute overflow app></v-navigation-drawer>
    <v-toolbar :clipped-left="primaryDrawer.clipped" app absolute>
      <v-toolbar-side-icon @click.stop="primaryDrawer.model = !primaryDrawer.model"></v-toolbar-side-icon>
      <v-toolbar-title>Explorer</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class App extends Vue {
  dark: Boolean = true;
  drawers: Array<String> = ["Default (no property)", "Permanent", "Temporary"];
  primaryDrawer: Object = {
    model: null
  };
  footer: Object = {
    inset: false
  };
}
</script>