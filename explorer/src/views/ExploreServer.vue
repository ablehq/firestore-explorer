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
    <v-layout column class="mx-2 mt-4" v-if="responseData.length > 0">
      <v-layout>
        <v-flex class="md3">
          <p class="subheading">ID</p>
        </v-flex>
        <v-flex class="md6">
          <p class="subheading">Document</p>
        </v-flex>
        <v-flex class="md3">
          <p class="subheading">Sub Collections</p>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex class="md3">
          <v-card>
            <v-list>
              <template v-for="(item, index) in responseData">
                <v-divider
                  v-if="index > 0"
                  :key="`divider-${item.id}`"
                ></v-divider>
                <v-list-tile
                  :key="item.id"
                  @click="documentIDClicked(item.path)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.id"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex class="md6 ml-2">
          <v-card>
            <v-btn flat outline>Hey</v-btn>
          </v-card>
        </v-flex>
        <v-flex class="md3 ml-2">
          <v-card>
            <v-btn flat outline>Hey</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
const axios = require("axios");
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import MonacoEditor from "vue-monaco";
type DataItem = {
  id: string;
  path: string;
  data: any;
};
type ResponseData = Array<DataItem>;
@Component({
  components: {
    MonacoEditor
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
  responseData: ResponseData = [];
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
    }).then((resp: any) => {
      return resp.data;
    });

    this.responseData = responseData.data;
  }

  documentIDClicked(path: string) {
    console.log(path);
  }
}
</script>

<style scoped>
.editor {
  height: 100px;
}
</style>
