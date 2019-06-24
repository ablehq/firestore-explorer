<template>
  <v-container fluid>
    <v-toolbar flat color="transparent">
      <v-btn icon to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
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
            <v-flex v-if="!isCloud">
              <v-text-field
                required
                :disabled="loading"
                v-model="appId"
                :rules="generalStringRules('App Id')"
                label="App Id"
                outline
              ></v-text-field>
            </v-flex>
            <v-flex v-if="!isCloud">
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
                v-model="config"
                :disabled="loading"
                :rules="validateConfig()"
                label="Config JSON"
                key="config"
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
                >{{ this.isInEditMode ? "Update" : "Create" }}</v-btn
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
import { Prop } from "vue-property-decorator";
import { Object } from "lodash";
@Component({})
export default class NewServer extends Vue {
  @Prop(String) readonly serverId!: string;
  valid: boolean = false;
  name: string = "";
  appId: string = "";
  projectId: string = "";
  serverType: string = "emulated";
  serverColor: string = randomcolor({
    luminosity: "random",
    hue: "random"
  }) as string;
  config: string = "";
  loading: boolean = false;
  snackbar: boolean = false;
  errorText: string = "";
  isInEditMode: boolean = false;

  created() {
    if (this.serverId) {
      const servers = this.$store.getters.servers as Array<Server>;
      const server = servers.find(item => `${item.id}` === this.serverId);
      if (server) {
        this.name = server.name;
        this.serverType = server.type;
        this.serverColor = server.color;
        switch (server.type) {
          case "emulated":
            this.appId = server.appId;
            this.projectId = server.projectId;
            break;
          case "cloud":
            this.config = JSON.stringify(server.config);
            break;
        }
      }
      this.isInEditMode = true;
    }
  }

  get formTitle(): string {
    if (this.isInEditMode) {
      return `Edit ${this.name}`;
    }
    return `Create New Server`;
  }

  generalStringRules(name: string) {
    return [
      (v: string) => !!v || `${name} is required`,
      (v: string) =>
        (v && v.length >= 2) || `${name}  must be at least 2 characters`
    ];
  }

  validateConfig() {
    return [
      (v: string) => !!v || "Config is required",
      (v: string) => {
        try {
          let parsed = JSON.parse(v);
          if (JSON.stringify(parsed) === "{}") {
            return "Config cannot be empty object";
          }
          return true;
        } catch (error) {
          return "Config does not seem to be valid";
        }
      }
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
    if (!this.isInEditMode) {
      return GenerateEmulatedServer(
        this.name,
        this.serverColor,
        this.projectId,
        this.appId
      );
    } else {
      return GenerateEmulatedServer(
        this.name,
        this.serverColor,
        this.projectId,
        this.appId,
        this.serverId
      );
    }
  }

  buildCloudServer(): Server {
    if (!this.isInEditMode) {
      return GenerateCloudServer(
        this.name,
        this.serverColor,
        JSON.parse(this.config)
      );
    } else {
      return GenerateCloudServer(
        this.name,
        this.serverColor,
        JSON.parse(this.config),
        this.serverId
      );
    }
  }

  async createServer() {
    this.loading = true;
    if (this.isInEditMode) {
      const datum = await this.$store.dispatch<Action>({
        type: ActionTypes.EditServer,
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
    } else {
      const server: Server = this.isCloud
        ? this.buildCloudServer()
        : this.buildEmulatedServer();
      const datum = await this.$store.dispatch<Action>({
        type: ActionTypes.AddNewServer,
        payload: server
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
}
</script>

<style scoped></style>
