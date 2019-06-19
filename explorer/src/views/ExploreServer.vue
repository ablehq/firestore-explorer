<template>
  <v-container fluid v-if="isServerAvailable">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title :color="server.color">
        {{ formTitle }}
        <v-icon :color="server.color">{{
          server.type === "emulated" ? "adb" : "cloud"
        }}</v-icon>
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <v-layout column>
        <v-flex xs12 md12>
          <v-textarea
            outline
            name="input-7-4"
            solo
            persistent-hint
            hint="Use `db` variable to reference your firestore db"
            :value="query"
          ></v-textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
@Component({})
export default class ExploreApp extends Vue {
  @Prop(String) readonly serverId!: string;
  server!: Server;
  isServerAvailable = false;
  query: string = "";

  created() {
    const servers = this.$store.getters.servers as Array<Server>;
    if (servers.length > 0) {
      const foundServer = servers.find(item => `${item.id}` === this.serverId);
      if (foundServer) {
        this.server = foundServer;
        this.isServerAvailable = true;
      }
    }
    if (!this.isServerAvailable) {
      this.$router.push("/");
    }
  }

  get formTitle(): string {
    return this.server.name;
  }

  exploreCollection(root: string) {
    console.log(`Explore collection ${root}`);
  }
}
</script>

<style scoped></style>
