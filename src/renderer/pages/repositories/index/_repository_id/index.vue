<template>
  <section>
    <repository-details v-if="repository" :repository="repository" />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from "@nuxtjs/composition-api";
import List from "~/components/Repository/List/List.vue";
import Repository from "~/models/Repository.ts";
import RepositoryDetails from "~/components/Repository/Details/Details.vue";

export default defineComponent({
  name: "Index",
  components: { List, RepositoryDetails },
  setup() {
    const { params } = useContext();

    const repository = computed(() =>
      Repository.query().with("pull_requests").find(params.value.repository_id)
    );

    return { repository };
  },
});
</script>
