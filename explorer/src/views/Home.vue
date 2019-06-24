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
          <v-flex xs12 md4 v-for="server in servers" :key="server.id">
            <v-card>
              <v-card-title primary-title>
                <v-layout row wrap justify-space-between>
                  <v-flex>
                    <span class="title" :style="{ color: server.color }">
                      {{ server.name }}
                    </span>
                  </v-flex>
                  <v-flex shrink>
                    <v-icon :color="server.color">
                      {{ server.type === "emulated" ? "adb" : "cloud" }}
                    </v-icon>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <code>{{ readableConfig(server) }}</code>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn flat small icon @click.stop="showDeleteDialog(server)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn flat small icon @click.stop="editServer(server)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  v-if="server.isCloud"
                  flat
                  small
                  icon
                  @click.stop="showServerConfigDialog(server)"
                >
                  <v-icon>code</v-icon>
                </v-btn>
                <v-btn flat small icon @click.stop="showQueryConsole(server)">
                  <v-icon>video_label</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn flat small @click.stop="exploreServer(server)">
                  Explore
                  <v-icon right>arrow_right_alt</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline"
          >Delete {{ serverToBeDeleted.name }}</v-card-title
        >

        <v-card-text>
          Do you want to permanently delete server
          {{ serverToBeDeleted.name }}.
        </v-card-text>

        <v-card-actions>
          <v-btn flat @click="cancelDeleteDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="red darken-1" @click="deleteServer">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="configDialog">
      <v-card>
        <v-card-title class="headline">
          {{ serverToBeShownConfig.name }}
        </v-card-title>

        <v-card-text v-if="configDialog">
          <code>{{ serverToBeShownConfig.config }}</code>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="cancelConfigDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="3000" top vertical>{{
      errorText
    }}</v-snackbar>
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
  deleteDialog: boolean = false;
  serverToDelete: Server | {} = {};
  configDialog: boolean = false;
  serverToShowConfig: Server | {} = {};
  snackbar: boolean = false;
  errorText: string = "";

  created() {
    this.$store.dispatch<Action>({
      type: ActionTypes.FetchServers,
      payload: {}
    });
  }

  get servers(): Array<Server> {
    return this.$store.getters.servers;
  }

  showDeleteDialog(server: Server) {
    this.deleteDialog = true;
    this.serverToDelete = server;
  }

  showServerConfigDialog(server: Server) {
    this.configDialog = true;
    this.serverToShowConfig = server;
  }

  cancelDeleteDialog() {
    this.deleteDialog = false;
  }

  cancelConfigDialog() {
    this.configDialog = false;
  }

  get serverToBeDeleted() {
    return this.serverToDelete || {};
  }

  get serverToBeShownConfig() {
    return this.serverToShowConfig || {};
  }

  readableConfig(server: Server) {
    if (server.type === "emulated") {
      return server;
    }
    const { config, ...rest } = server;
    return rest;
  }

  async deleteServer() {
    this.deleteDialog = false;
    const datum = await this.$store.dispatch<Action>({
      type: ActionTypes.DeleteServer,
      payload: {
        serverId: (this.serverToDelete as Server).id
      }
    });
    if (!datum.success) {
      this.snackbar = true;
      this.errorText = datum.error.message;
    }
  }

  editServer(server: Server) {
    this.$router.push({
      name: "edit-server",
      params: {
        serverId: `${server.id}`
      }
    });
  }

  exploreServer(server: Server) {
    this.$router.push({
      name: "list-root-collections",
      params: {
        serverId: `${server.id}`
      }
    });
  }

  showQueryConsole(server: Server) {
    this.$router.push({
      name: "explore-server",
      params: {
        serverId: `${server.id}`
      }
    });
  }
}
</script>

<style scoped>
code {
  background-color: transparent;
  color: #999;
  box-shadow: 0 0 0 0;
}
</style>
