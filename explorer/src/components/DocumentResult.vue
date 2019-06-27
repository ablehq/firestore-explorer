<template>
  <v-flex>
    <v-card>
      <v-flex>
        <v-list-tile class="pa-2">
          <v-list-tile-content>
            <v-list-tile-title
              v-text="this.response.data.id"
            ></v-list-tile-title>
            <v-list-tile-sub-title>
              {{ this.response.data.path }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <code :class="codeClass">{{ documentData }}</code>
      </v-flex>
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

  get isThemeDark(): boolean {
    return this.$store.getters.isThemeDark;
  }

  get documentData() {
    return this.response ? this.response.data.data : "";
  }

  get codeClass() {
    return this.isThemeDark ? ["pa-2", "code-dark"] : ["pa-2", "code-light"];
  }
}
</script>

<style scoped>
.code-dark {
  background-color: transparent;
  color: #c0c0c0;
  box-shadow: 0 0 0 0;
}
.code-light {
  background-color: transparent;
  color: #434040;
  box-shadow: 0 0 0 0;
}
</style>
