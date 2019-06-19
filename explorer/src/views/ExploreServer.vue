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
    <v-flex>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 md4 v-for="root in server.roots" :key="root">
            <v-card>
              <v-card-title primary-title>
                <span class="title">{{ root }}</span>
              </v-card-title>
              <v-card-text>
                <p>Details of root go here</p>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat small @click.stop="exploreCollection(root)">
                  Explore
                  <v-icon right>arrow_right_alt</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
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
