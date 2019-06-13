<template>
  <v-container fluid class="py-0">
    <v-toolbar flat color="transparent">
      <v-toolbar-title>Servers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat small :to="{ name: 'new-server' }">
        <v-icon left>add</v-icon>Add Server
      </v-btn>
    </v-toolbar>
    <v-flex>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 md4 v-for="server in servers" :key="server.name">
            <v-card>
              <v-card-title primary-title>
                <v-layout row wrap justify-space-between>
                  <v-flex>
                    <span class="title">{{ server.name }}</span>
                  </v-flex>
                  <v-flex shrink>
                    <v-icon :color="server.color">{{ server.type === "emulated" ? "adb" : "cloud" }}</v-icon>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <span color="red" class="body">add details of server like url, api key etc</span>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn flat small icon @click.stop="showDialog(server.name)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn flat small>
                  Explore
                  <v-icon right>arrow_right_alt</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete {{ serverSelectedToDelete }}</v-card-title>

        <v-card-text>
          Do you want to permanently delete server
          {{ serverSelectedToDelete }}.
        </v-card-text>

        <v-card-actions>
          <v-btn flat @click="cancelDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="red darken-1" @click="deleteServer">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Server } from "../stores/servers/State";
import { Action, ActionTypes } from "../stores";
@Component({
  components: {}
})
export default class Home extends Vue {
  dialog: boolean = false;
  serverSelectedToDelete: string = "";
  get servers(): Array<Server> {
    return this.$store.getters.servers;
  }

  showDialog(serverName: string) {
    this.dialog = true;
    this.serverSelectedToDelete = serverName;
  }

  cancelDialog() {
    this.dialog = false;
    this.serverSelectedToDelete = "";
  }

  async deleteServer() {
    this.dialog = false;
    await this.$store.dispatch<Action>({
      type: ActionTypes.DeleteServer,
      payload: {
        serverName: this.serverSelectedToDelete
      }
    });
    this.serverSelectedToDelete = "";
  }
}
</script>

<style scoped></style>
