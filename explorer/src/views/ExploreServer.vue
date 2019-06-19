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
      <monaco-editor
        class="editor"
        v-model="query"
        :theme="editorTheme"
        :options="editorOptions"
        :language="editorLanguages"
      ></monaco-editor>
    </v-flex>
    <v-flex>
      <v-btn large @click.stop="executeQuery">
        Run
        <v-icon right>play_arrow</v-icon>
      </v-btn>
    </v-flex>

    <prism language="json">{{ responseJson }}</prism>
  </v-container>
</template>

<script lang="ts">
const axios = require("axios");
import Prism from "vue-prism-component";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import MonacoEditor from "vue-monaco";
@Component({
  components: {
    MonacoEditor,
    Prism
  }
})
export default class ExploreApp extends Vue {
  @Prop(String) readonly serverId!: string;
  server!: Server;
  isServerAvailable = false;
  query: string = "";
  editorOptions = {
    minimap: {
      enabled: false
    },
    lineNumbers: true
  };
  editorLanguages = "javascript";
  responseLanguage = "json";
  responseJson = {
    hello: "world"
  };
  responseRendererOptions = {
    readOnly: true,
    minimap: {
      enabled: false
    },
    lineNumbers: true
  };

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

  get editorTheme(): string {
    return this.$store.getters.isThemeDark ? "vs-dark" : "vs";
  }

  async executeQuery() {
    const responseData = await axios({
      method: "post",
      url: "http://localhost:7000/command",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: {
        name: "query",
        payload: {
          server: this.server,
          query: this.query
        }
      }
    }).then((resp: any) => resp.data);
    this.responseJson = responseData;
  }
}
</script>

<style scoped>
.editor {
  height: 200px;
}
</style>
