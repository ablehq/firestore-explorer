<template>
  <v-container fluid v-if="isServerAvailable">
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title :color="server.color">
        {{ formTitle }}
        <v-icon :color="server.color">
          {{ server.type === "emulated" ? "adb" : "cloud" }}
        </v-icon>
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg v-if="isServerAvailable">
      <v-data-table
        :headers="headers"
        :items="roots"
        disable-initial-sort
        hide-actions
        class="elevation-1"
      >
        <template v-slot:items="props">
          <tr @click.stop="handleRootClick(props.item)">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.path }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </v-container>
</template>

<script lang="ts">
const axios = require("axios");
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import MonacoEditor from "vue-monaco";

interface RootCollection {
  id: string;
  path: string;
}

@Component({
  components: {
    MonacoEditor
  }
})
export default class ExploreApp extends Vue {
  @Prop(String) readonly serverId!: string;
  server!: Server;
  isServerAvailable = false;
  roots: Array<RootCollection> = [];
  headers: Array<{ text: string; value: string }> = [
    { text: "ID", value: "id" },
    { text: "Path", value: "path" }
  ];
  created() {
    const servers = this.$store.getters.servers as Array<Server>;
    if (servers.length > 0) {
      const foundServer = servers.find(item => `${item.id}` === this.serverId);
      if (foundServer) {
        this.server = foundServer;
        this.isServerAvailable = true;
        this.queryListRoots();
      }
    }
    if (!this.isServerAvailable) {
      this.$router.push("/");
    }
  }

  get formTitle(): string {
    return this.server.name;
  }

  async queryListRoots() {
    try {
      const responseData = await axios({
        method: "post",
        url: "http://localhost:7000/command",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: {
          name: "list_roots",
          payload: {
            server: this.server
          }
        }
      }).then((resp: any) => resp.data);
      this.roots = responseData.data;
    } catch (error) {
      console.log("Handle error exploring root collections");
    }
  }

  handleRootClick() {
    console.log("Root Clicked");
  }
}
</script>

<style scoped>
.editor {
  height: 200px;
}
</style>
