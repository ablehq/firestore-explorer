<template>
  <nav>
    <v-toolbar flat app color="transparent">
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Firestore Explorer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat @click="toggleDarkMode">
        <v-icon>invert_colors</v-icon>
        {{ toggleDarkModeText }}
      </v-btn>
    </v-toolbar>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapActions, mapGetters } from "vuex";
import { ActionTypes, Action } from "../stores";
@Component({})
export default class Navbar extends Vue {
  get isThemeDark(): boolean {
    return this.$store.getters.isThemeDark;
  }

  get toggleDarkModeText(): string {
    return this.isThemeDark ? "Dark Theme" : "Light Theme";
  }

  toggleDarkMode() {
    this.$store.dispatch<Action>({
      type: ActionTypes.SetTheme,
      payload: {
        darkModeOn: !this.isThemeDark
      }
    });
  }
}
</script>

<style scoped></style>
