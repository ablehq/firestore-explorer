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
    <v-flex>
      <v-breadcrumbs :items="breadcrumbs" divider=">">
        <template v-slot:item="props">
          <v-chip label @click="breadcrumbClicked(props.item)">
            {{ props.item.text }}
          </v-chip>
        </template>
      </v-breadcrumbs>
    </v-flex>
    <query-snapshot-result
      v-if="isQuerySnapshot"
      :response="queryResponse"
      :selectedDocumentDataResponse="selectedDocumentDataResponse"
      :selectedDocumentSubCollectionResponse="
        selectedDocumentSubCollectionResponse
      "
      @documentClicked="documentClicked"
      @subCollectionClicked="subCollectionClicked"
    />
    <document-sub-collection-result
      v-if="isDocumentSnapshot"
      :response="queryResponse"
      :subCollectionResponse="documentSubCollectionResponse"
      @subCollectionClicked="subCollectionClicked"
    />
    <collection-result
      v-if="isCollectionSnapshot"
      :response="queryResponse"
      @subCollectionClicked="subCollectionClicked"
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
  CollectionArrayResponse,
  QuerySnapshotResponse
} from "../stores/query";
import QuerySnapshotResult from "../components/QuerySnapshotResult.vue";
import DocumentSubCollectionResult from "../components/DocumentSubCollectionResult.vue";
import CollectionResult from "../components/CollectionResult.vue";
import MonacoEditor from "vue-monaco";
const commonHttpParams = {
  method: "post",
  url: "http://localhost:7000/command",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};
type PathBreadcrumb = {
  text: string;
  disabled: boolean;
  pathComponents: Array<string>;
  isDocument: boolean;
};
@Component({
  components: {
    MonacoEditor,
    QuerySnapshotResult,
    DocumentSubCollectionResult,
    CollectionResult
  }
})
export default class ExploreApp extends Vue {
  @Prop(String) readonly serverId!: string;
  server!: Server;
  isServerAvailable = false;
  query: string = "db.listCollections()";
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
  breadcrumbs: Array<PathBreadcrumb> = [];

  created() {
    const servers = this.$store.getters.servers as Array<Server>;
    if (servers.length > 0) {
      const foundServer = servers.find(item => `${item.id}` === this.serverId);
      if (foundServer) {
        this.server = foundServer;
        this.isServerAvailable = true;
        this.executeQuery();
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

  get isCollectionSnapshot(): boolean {
    return (
      this.isResponseAvailable && this.queryResponse.type === "CollectionArray"
    );
  }

  async executeQuery() {
    try {
      this.isResponseAvailable = false;
      this.selectedDocumentDataResponse = null;
      this.selectedDocumentSubCollectionResponse = null;
      this.documentSubCollectionResponse = null;
      this.queryResponse = await axios({
        ...commonHttpParams,
        data: {
          name: "query",
          payload: {
            server: this.server.id,
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
              server: this.server.id,
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
    this.buildBreadcrumbs();
    this.isResponseAvailable = true;
  }

  async documentClicked(item: QueryResponseItem) {
    try {
      const documentData = await axios({
        ...commonHttpParams,
        data: {
          name: "query",
          payload: {
            server: this.server.id,
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
            server: this.server.id,
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

  async subCollectionClicked(item: QueryResponseItem) {
    this.query = `db.collection('${item.path}').limit(10).get()`;
    this.executeQuery();
  }

  async breadcrumbClicked(item: PathBreadcrumb) {
    let path = item.pathComponents.join("/");
    if (item.isDocument) {
      this.query = `db.doc('${path}').get()`;
    } else {
      let path = item.pathComponents.join(",");
      this.query = `db.collection('${path}').limit(10).get()`;
    }
    this.executeQuery();
  }

  buildBreadcrumbs() {
    let res: QueryResponse;
    let commonPath = "";
    switch (this.queryResponse.type) {
      case "QuerySnapshot":
        res = this.queryResponse as QuerySnapshotResponse;
        if (res.data.length > 0) {
          commonPath = this.sharedStart(res.data.map(item => item.parent));
        }
        break;
      case "DocumentSnapshot":
      case "QueryDocumentSnapshot":
        res = this.queryResponse as DocumentResponse;
        commonPath = res.data.path;
        break;
      case "CollectionArray":
        res = this.queryResponse as CollectionArrayResponse;
        if (res.data.length > 0) {
          commonPath = this.sharedStart(res.data.map(item => item.path));
        }
        break;
    }
    if (commonPath !== "") {
      this.breadcrumbs = commonPath
        .split("/")
        .reduce<Array<PathBreadcrumb>>(
          (
            acc: Array<PathBreadcrumb>,
            item: string,
            index: number,
            source: Array<string>
          ) => {
            const crumb: PathBreadcrumb = {
              pathComponents: source.slice(0, index + 1),
              text: item,
              disabled: false,
              isDocument: index % 2 === 1
            };
            return acc.concat(crumb);
          },
          []
        );
    }
  }

  sharedStart(array: Array<string>) {
    let A = array.concat().sort();
    let a1 = A[0];
    let a2 = A[A.length - 1];
    let L = a1.length;
    let i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
    return a1.substring(0, i);
  }
}
</script>

<style scoped>
.editor {
  height: 100px;
}
</style>
