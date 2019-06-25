<template>
  <v-flex>
    <v-card>
      <v-layout column class="pa-2">
        <v-flex>
          <p>
            <span class="subheading">ID: {{ response.data.id }}</span>
          </p>
        </v-flex>
        <v-flex>
          <p>
            <span class="subheading">Path: {{ response.data.path }}</span>
          </p>
        </v-flex>
        <v-divider></v-divider>
        <v-flex class="my-2">
          <code>{{ documentData }}</code>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
const axios = require("axios");
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Server } from "../stores/servers/State";
import {
  DocumentSnapshotResponse,
  QueryDocumentSnapshotResponse,
  QueryResponseItem
} from "../stores/query";
@Component({})
export default class DocumentResponse extends Vue {
  @Prop(Object) readonly response!:
    | DocumentSnapshotResponse
    | QueryDocumentSnapshotResponse;

  get documentData() {
    return this.response ? this.response.data.data : "";
  }
}
</script>

<style scoped>
code {
  background-color: transparent;
  color: #0e0e0e;
  box-shadow: 0 0 0 0;
}
</style>
