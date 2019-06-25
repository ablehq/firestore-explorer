<template>
  <v-layout column class="mx-2 mt-4">
    <v-layout>
      <v-flex class="md6" v-if="selectedDocumentResponse !== null">
        <p class="subheading">Document</p>
      </v-flex>
      <v-flex class="md3" v-if="selectedDocSubCollectionResponse !== null">
        <p class="subheading">Sub Collections</p>
      </v-flex>
    </v-layout>
    <v-layout>
      <document-response
        v-if="selectedDocumentResponse !== null"
        class="md6"
        :response="selectedDocumentResponse"
      />
      <collection-response
        v-if="selectedDocSubCollectionResponse !== null"
        class="md6 ml-2"
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
export default class DocumentSnapshotResult extends Vue {
  @Prop(Object) readonly response!:
    | DocumentSnapshotResponse
    | QueryDocumentSnapshotResponse;
  @Prop(Object)
  readonly subCollectionResponse!: CollectionArrayResponse | null;

  get selectedDocumentResponse() {
    if (this.response) {
      return this.response;
    }
    return null;
  }

  get selectedDocSubCollectionResponse() {
    if (this.subCollectionResponse) {
      return this.subCollectionResponse;
    }
    return null;
  }
}
</script>

<style scoped></style>
