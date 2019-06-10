<template>
  <v-app id="explorer" :dark="dark">
    <navbar></navbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">&copy; The Firestore Explorer 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import Navbar from "./components/Navbar.vue";
import Component from "vue-class-component";

@Component({
  components: { Navbar }
})
export default class App extends Vue {
  dark: Boolean = true;
  footer: Object = {
    inset: false
  };
}
</script>
