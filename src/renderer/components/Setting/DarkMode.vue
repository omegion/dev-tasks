<template>
  <b-field>
    <template slot="label">
      Dark Mode
      <p class="is-size-7">Help to improve the application.</p>
    </template>
    <b-switch v-model="analytics" @input="save" />
  </b-field>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import Setting from "~/models/Setting";

export default defineComponent({
  name: "DarkMode",
  setup() {
    const analytics = computed({
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
      analytics,
      save
    };
  }
});
</script>
