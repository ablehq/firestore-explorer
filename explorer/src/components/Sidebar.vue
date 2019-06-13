<template>
  <v-layout column fill-height>
    <v-flex>
      <v-card flat>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
          aspect-ratio="2.75"
        ></v-img>

        <v-card-title primary-title>
          <v-layout column>
            <v-layout row align-center class="mb-4">
              <v-avatar size="40" color="grey lighten-4 mr-4">
                <img
                  src="https://vuetifyjs.com/apple-touch-icon-180x180.png"
                  alt="avatar"
                />
              </v-avatar>
              <h3 class="headline mb-0">John Doe</h3>
            </v-layout>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur, culpa doloribus fuga pariatur rem incidunt reiciendis
              repellat quasi, fugiat placeat illo mollitia dolore ab alias, unde
              ea porro ipsum? Consequatur.
            </div>
          </v-layout>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-divider></v-divider>
    <v-flex fill-height>
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <v-list-tile
            v-for="subItem in item.items"
            :key="subItem.title"
            @click="handleItemClick"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-flex>
    <v-divider></v-divider>

    <v-layout column>
      <v-layout row justify-center class="py-2 px-3">
        <v-btn flat block @click="toggleDarkMode">
          <v-icon left>shuffle</v-icon>
          {{ toggleDarkModeText }}
        </v-btn>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapActions, mapGetters } from "vuex";
import { ActionTypes, Action } from "../stores";
@Component({})
export default class Sidebar extends Vue {
  items = [
    {
      title: "Servers",
      active: false,
      action: "cloud",
      items: [
        {
          title: "Local test server",
          action: "flash_on"
        }
      ]
    },
    {
      title: "App Settings",
      active: false,
      action: "cloud",
      items: [
        {
          title: "Dark Mode",
          action: "settings"
        }
      ]
    }
  ];

  handleItemClick(item: any) {
    console.log(item);
  }

  get isThemeDark(): boolean {
    return this.$store.getters.isThemeDark;
  }

  get toggleDarkModeText(): string {
    return this.isThemeDark ? "Turn off Dark Mode" : "Turn on Dark Mode";
  }

  toggleDarkMode() {
    this.$store.dispatch<Action>({
      type: ActionTypes.SetTheme,
      payload: {
        darkModeOn: !this.isThemeDark
      }
    });
  }
}
</script>

<style scoped></style>
