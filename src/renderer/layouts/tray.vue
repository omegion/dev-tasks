<template>
  <div class="tray-main-wrap">
    <nuxt />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  watch
} from "@nuxtjs/composition-api";
import Setting from "~/models/Setting";

export default defineComponent({
  name: "Tray",
  setup() {
    const isDarkMode = computed(
      () => Setting.get("dark_mode", false) === "true"
    );

    const decideMode = () => {
      if (isDarkMode.value) {
        document.body.classList.add("is-dark");
      } else {
        document.body.classList.remove("is-dark");
      }
    };

    watch(isDarkMode, decideMode);

    onMounted(() => {
      document.body.classList.add("is-transparent");
      decideMode();
    });
  }
});
</script>
