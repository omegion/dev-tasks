<template>
  <div>
    <portal to="inner-left">
      <task-list />
    </portal>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from "@nuxtjs/composition-api";
import TaskList from "~/components/Task/List/List.vue";

export default defineComponent({
  name: "Index",
  components: {
    TaskList
  },
  setup() {
    const { route } = useContext();

    const isTaskSelected = computed(
      () => route.value.name === "projects.project_id.tasks.index.task_id"
    );

    return { isTaskSelected };
  }
});
</script>
