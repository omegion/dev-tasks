<template>
  <b-field>
    <template slot="label">
      Dark Mode
      <p class="is-size-7">Enable dark mode for the application.</p>
    </template>
    <b-switch v-model="darkMode" @input="save" />
  </b-field>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import Setting from "~/models/Setting";

export default defineComponent({
  name: "DarkMode",
  setup() {
    const darkMode = computed({
      get: () => {
        const setting = Setting.get("dark_mode");
        if (setting) {
          return setting;
        }
        return false;
      },
      set: () => {}
    });

    const save = value => {
      Setting.set("dark_mode", value);
    };

    return {
      darkMode,
      save
    };
  }
});
</script>
