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
                <code>{{ server }}</code>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  flat
                  small
                  icon
                  color="grey darken-2"
                  @click.stop="showDialog(server)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn
                  flat
                  small
                  icon
                  color="grey darken-2"
                  @click.stop="editServer(server)"
                >
                  <v-icon>edit</v-icon>
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
        <v-card-title class="headline"
          >Delete {{ serverToBeDeleted.name }}</v-card-title
        >

        <v-card-text>
          Do you want to permanently delete server
          {{ serverToBeDeleted.name }}.
        </v-card-text>

        <v-card-actions>
          <v-btn flat @click="cancelDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="red darken-1" @click="deleteServer">Delete</v-btn>
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
  dialog: boolean = false;
  serverToDelete: Server | {} = {};
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

  showDialog(server: Server) {
    this.dialog = true;
    this.serverToDelete = server;
  }

  cancelDialog() {
    this.dialog = false;
  }

  get serverToBeDeleted() {
    return this.serverToDelete || {};
  }

  async deleteServer() {
    this.dialog = false;
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
}
</script>

<style scoped>
code {
  background-color: transparent;
  color: #999;
  box-shadow: 0 0 0 0;
}
</style>
