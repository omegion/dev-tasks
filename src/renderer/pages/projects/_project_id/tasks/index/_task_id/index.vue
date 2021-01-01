<template>
  <section>
    <div class="columns">
      <div class="column task-wrap">
        <task-details :task="task" />
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext
} from "@nuxtjs/composition-api";
import TaskDetails from "@/components/Task/Details/Details.vue";
import Task from "~/models/Task";

export default defineComponent({
  name: "TaskShow",
  components: {
    TaskDetails
  },
  setup(props, { root }) {
    const title = ref();

    const { params, route } = useContext();

    const task = computed(() => {
      return Task.query()
        .withAllRecursive()
        .find(params.value.task_id);
    });

    return { task, title };
  }
});
</script>
