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
    <query-snapshot-response
      v-if="isQuerySnapshot"
      :response="queryResponse"
      :selectedDocumentDataResponse="selectedDocumentDataResponse"
      :selectedDocumentSubCollectionResponse="
        selectedDocumentSubCollectionResponse
      "
      @documentClicked="documentClicked"
    />
    <document-sub-collection-response
      v-if="isDocumentSnapshot"
      :response="queryResponse"
      :subCollectionResponse="documentSubCollectionResponse"
      @documentClicked="documentClicked"
    />
  </v-container>
</template>

<script lang="ts">
const axios = require("axios");
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import {
  QueryResponse,
  DocumentSnapshotResponse,
  QueryDocumentSnapshotResponse,
  QueryResponseItem,
  DocumentResponse,
  CollectionArrayResponse
} from "../stores/query";
import QuerySnapshotResponse from "../components/QuerySnapshotResponse.vue";
import DocumentSubCollectionResponse from "../components/DocumentSubCollectionResponse.vue";
import MonacoEditor from "vue-monaco";
const commonHttpParams = {
  method: "post",
  url: "http://localhost:7000/command",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};
@Component({
  components: {
    MonacoEditor,
    QuerySnapshotResponse,
    DocumentSubCollectionResponse
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
  queryResponse!: QueryResponse;
  isResponseAvailable = false;
  responseRendererOptions = {
    readOnly: true,
    minimap: {
      enabled: false
    },
    lineNumbers: true
  };
  selectedDocumentDataResponse: DocumentResponse | null = null;
  selectedDocumentSubCollectionResponse: CollectionArrayResponse | null = null;
  documentSubCollectionResponse: CollectionArrayResponse | null = null;

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

  get isDocumentSnapshot(): boolean {
    return (
      this.isResponseAvailable &&
      (this.queryResponse.type === "DocumentSnapshot" ||
        this.queryResponse.type === "QueryDocumentSnapshot")
    );
  }

  get isQuerySnapshot(): boolean {
    return (
      this.isResponseAvailable && this.queryResponse.type === "QuerySnapshot"
    );
  }

  async executeQuery() {
    try {
      this.isResponseAvailable = false;
      this.queryResponse = await axios({
        ...commonHttpParams,
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
      if (
        this.queryResponse.type === "DocumentSnapshot" ||
        this.queryResponse.type === "QueryDocumentSnapshot"
      ) {
        const docPath = (this.queryResponse as DocumentResponse).data.path;
        this.documentSubCollectionResponse = await axios({
          ...commonHttpParams,
          data: {
            name: "query",
            payload: {
              server: this.server,
              query: `db.doc('${docPath}').listCollections()`
            }
          }
        }).then((resp: any) => {
          return resp.data;
        });
      }
    } catch (error) {
      console.log("Recevied error executing query");
      console.error(error);
    }
    this.isResponseAvailable = true;
  }

  async documentClicked(item: QueryResponseItem) {
    try {
      const documentData = await axios({
        ...commonHttpParams,
        data: {
          name: "query",
          payload: {
            server: this.server,
            query: `db.doc('${item.path}').get()`
          }
        }
      }).then((resp: any) => {
        return resp.data;
      });
      this.selectedDocumentDataResponse = documentData;

      const subCollectionData = await axios({
        ...commonHttpParams,
        data: {
          name: "query",
          payload: {
            server: this.server,
            query: `db.doc('${item.path}').listCollections()`
          }
        }
      }).then((resp: any) => {
        return resp.data;
      });
      this.selectedDocumentSubCollectionResponse = subCollectionData;
    } catch (error) {
      console.log("Recevied error executing query");
      console.error(error);
    }
  }
}
</script>

<style scoped>
.editor {
  height: 100px;
}
</style>
