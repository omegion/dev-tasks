<template>
  <div class="columns inner-wrap">
    <div class="column has-border-right is-inner-left">
      <list />
    </div>
    <div class="column is-9 is-inner-right">
      <NuxtChild />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import List from "~/components/Repository/List/List.vue";

export default defineComponent({
  name: "Index",
  components: { List },
  setup(props, { root }) {
    return {};
  },
});
</script>
