<template>
  <v-container fluid>
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Create New Server</v-toolbar-title>
    </v-toolbar>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md3>
          <v-form v-model="valid" ref="serverForm">
            <v-flex>
              <v-radio-group
                row
                class="mt-0"
                v-model="serverType"
                :disabled="loading"
              >
                <v-radio
                  label="Emulated"
                  value="emulated"
                  color="success"
                  :disabled="loading"
                ></v-radio>
                <v-radio label="Cloud" value="cloud" color="success"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex>
              <v-text-field
                required
                v-model="name"
                :disabled="loading"
                :rules="generalStringRules('Server Name')"
                label="Server Name"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                required
                :disabled="loading"
                v-model="appId"
                :rules="generalStringRules('App Id')"
                label="App Id"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                required
                :disabled="loading"
                v-model="projectId"
                :rules="generalStringRules('Project Id')"
                label="Project Id"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="isCloud">
              <v-text-field
                v-model="apiKey"
                :disabled="loading"
                :rules="generalStringRules('Api Key')"
                label="Api Key"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="isCloud">
              <v-text-field
                v-model="authDomain"
                :disabled="loading"
                :rules="generalStringRules('Auth Domain')"
                label="Auth Domain"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="isCloud">
              <v-text-field
                v-model="databaseURL"
                :rules="generalStringRules('Database URL')"
                label="Database URL"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="isCloud">
              <v-text-field
                v-model="storageBucket"
                :disabled="loading"
                :rules="generalStringRules('Storage Bucket')"
                label="Storage Bucket"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="isCloud">
              <v-text-field
                v-model="messagingSenderId"
                :rules="generalStringRules('Messaging SenderId')"
                label="Messaging SenderId"
                :disabled="loading"
                outline
              ></v-text-field>
            </v-flex>
            <v-layout align-center>
              <v-chip
                :disabled="loading"
                small
                :color="serverColor"
                @click="changeServerColor"
              ></v-chip>
              <v-card flat class="caption">server color tag</v-card>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                large
                @click="createServer"
                :loading="loading"
                >Create</v-btn
              >
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="snackbar" :timeout="3000" top vertical>
        {{ errorText }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import randomcolor from "randomcolor";
import { Action, ActionTypes } from "../stores";
import {
  Server,
  GenerateEmulatedServer,
  GenerateCloudServer
} from "../stores/servers/State";
@Component({})
export default class NewServer extends Vue {
  valid: boolean = false;
  name: string = "";
  appId: string = "";
  projectId: string = "";
  serverType: string = "emulated";
  serverColor: string = randomcolor({
    luminosity: "random",
    hue: "random"
  }) as string;
  apiKey: string = "";
  authDomain: string = "";
  databaseURL: string = "";
  storageBucket: string = "";
  messagingSenderId: string = "";
  loading: boolean = false;
  snackbar: boolean = false;
  errorText: string = "";

  generalStringRules(name: string) {
    return [
      (v: string) => !!v || `${name} is required`,
      (v: string) =>
        (v && v.length >= 4) || `${name}  must be at least 4 characters`
    ];
  }

  get isCloud(): boolean {
    return this.serverType === "cloud";
  }

  changeServerColor() {
    this.serverColor = randomcolor({
      luminosity: "random",
      hue: "random"
    }) as string;
  }

  buildEmulatedServer(): Server {
    return GenerateEmulatedServer(
      this.name,
      this.serverColor,
      this.projectId,
      this.appId
    );
  }

  buildCloudServer(): Server {
    return GenerateCloudServer(
      this.name,
      this.serverColor,
      this.projectId,
      this.appId,
      this.apiKey,
      this.authDomain,
      this.databaseURL,
      this.storageBucket,
      this.messagingSenderId
    );
  }

  async createServer() {
    this.loading = true;
    const datum = await this.$store.dispatch<Action>({
      type: ActionTypes.AddNewServer,
      payload: this.isCloud
        ? this.buildCloudServer()
        : this.buildEmulatedServer()
    });
    this.loading = false;
    if (datum.success) {
      this.$router.push({
        name: "home"
      });
    } else {
      this.snackbar = true;
      this.errorText = datum.error.message;
    }
  }
}
</script>

<style scoped></style>
