<template>
  <v-flex>
    <v-card>
      <v-list two-line>
        <template v-for="(item, index) in results">
          <v-divider v-if="index > 0" :key="`divider-${item.id}`"></v-divider>
          <v-list-tile :key="item.id" @click="subCollectionClicked(item)">
            <v-list-tile-content>
              <v-list-tile-title v-text="item.id"></v-list-tile-title>
              <v-list-tile-sub-title>{{ item.path }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
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
  QueryResponseItem,
  CollectionArrayResponse
} from "../stores/query";
@Component({})
export default class DocumentResponse extends Vue {
  @Prop(Object) readonly response!: CollectionArrayResponse;

  get results() {
    return this.response ? this.response.data : "";
  }

  subCollectionClicked(item: QueryResponseItem) {
    this.$emit("subCollectionClicked", item);
  }
}
</script>

<style scoped></style>
