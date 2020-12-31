<template>
  <div>
    <portal to="inner-left">
      <list />
    </portal>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import List from "~/components/Repository/List/List.vue";

const MIN = 100;
export default defineComponent({
  name: "Index",
  components: { List }
});
</script>
