<template>
  <v-layout column class="mx-2 mt-4">
    <v-layout>
      <v-flex class="md3">
        <p class="subheading">ID</p>
      </v-flex>
      <v-flex class="md6" v-if="selectedDocumentResponse !== null">
        <p class="subheading">Document</p>
      </v-flex>
      <v-flex class="md3" v-if="selectedDocSubCollectionResponse !== null">
        <p class="subheading">Sub Collections</p>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="md3">
        <v-card>
          <v-list>
            <template v-for="(item, index) in results">
              <v-divider
                v-if="index > 0"
                :key="`divider-${item.id}`"
              ></v-divider>
              <v-list-tile
                :key="item.id"
                @click="documentClicked(item)"
                :class="getBackground(item)"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.id"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <document-response
        v-if="selectedDocumentResponse !== null"
        class="md6 ml-2"
        :response="selectedDocumentResponse"
      />
      <collection-response
        v-if="selectedDocSubCollectionResponse !== null"
        class="md3 ml-2"
        :response="selectedDocSubCollectionResponse"
      />
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
const axios = require("axios");
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import {
  QuerySnapshotResponse,
  QueryResponseItem,
  DocumentSnapshotResponse,
  QueryDocumentSnapshotResponse,
  CollectionArrayResponse
} from "../stores/query";
import DocumentResponse from "./DocumentResponse.vue";
import CollectionResponse from "./CollectionResponse.vue";
@Component({
  components: {
    DocumentResponse,
    CollectionResponse
  }
})
export default class QuerySnapshotResult extends Vue {
  @Prop(Object) readonly response!: QuerySnapshotResponse;
  @Prop(Object) readonly selectedDocumentDataResponse!:
    | DocumentSnapshotResponse
    | QueryDocumentSnapshotResponse;
  @Prop(Object)
  readonly selectedDocumentSubCollectionResponse!: CollectionArrayResponse | null;

  selectedDocument: QueryResponseItem | null = null;
  selectedDocumentSubCollection: QueryResponseItem | null = null;
  get results(): Array<QueryResponseItem> {
    return this.response.data;
  }

  getBackground(item: QueryResponseItem) {
    if (this.selectedDocument && this.selectedDocument.id === item.id) {
      return ["light-blue", "lighten-5"];
    }
    return [];
  }

  documentClicked(item: QueryResponseItem) {
    this.selectedDocument = item;
    this.$emit("documentClicked", item);
  }

  get selectedDocumentResponse() {
    if (this.selectedDocumentDataResponse) {
      return this.selectedDocumentDataResponse;
    }
    return null;
  }

  get selectedDocSubCollectionResponse() {
    if (this.selectedDocumentSubCollectionResponse) {
      return this.selectedDocumentSubCollectionResponse;
    }
    return null;
  }
}
</script>

<style scoped></style>
