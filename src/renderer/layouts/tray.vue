<template>
  <div class="tray-main-wrap">
    <nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Tray",
  setup(props, { root }) {
    return {};
  }
});
</script>
