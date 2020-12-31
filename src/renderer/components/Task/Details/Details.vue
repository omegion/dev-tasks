<template>
  <section>
    <div class="columns">
      <div class="column">
        <task-name v-if="task" :task="task" />
        <task-description :blocks="blocks" />
      </div>
    </div>
    <portal to="inner-right">
      <task-sidebar v-if="task" :task="task" />
    </portal>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import TaskName from "~/components/Task/Details/Name.vue";
import TaskDescription from "~/components/Task/Details/Description.vue";
import TaskSidebar from "~/components/Task/Details/Sidebar/Sidebar.vue";
import Node from "~/components/Task/Dependency/Node.vue";

export default defineComponent({
  name: "Details",
  components: {
    TaskName,
    TaskDescription,
    TaskSidebar,
    Node
  },
  props: {
    task: {
      required: true
    }
  },
  setup(props, { root }) {
    const blocks = computed(() => {
      if (props.task) {
        // @ts-ignore
        return props.task.blocks;
      }
      return [];
    });

    return {
      blocks
    };
  }
});
</script>
