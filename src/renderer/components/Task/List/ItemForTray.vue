<template>
  <div>
    <div
      class="card has-no-shadow has-background-transparent is-cursor-pointer"
      @click="taskClicked"
    >
      <div class="card-content p-4">
        <p class="list-title has-text-weight-semibold">
          <b-icon
            size="is-small"
            icon="circle-medium"
            :type="currentStatus.type"
          />
          {{ task.name }}
        </p>
        <p class="is-size-7 has-text-grey">
          updated {{ task.updatedAt | humanize }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import Task from "~/models/Task";
import { ipcRenderer } from "electron";

export default defineComponent({
  name: "ItemForTray",
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props, { root }) {
    const currentStatus = computed(() =>
      Task.statusList().find(s => s.slug === props.task.status)
    );
    const currentPriority = computed(() =>
      Task.priorityList().find(s => s.value === props.task.priority)
    );
    const hasDependency = computed(
      () =>
        Task.query()
          .where("id", props.task.id)
          .has("dependencies", ">", 0)
          .count() > 0
    );

    const taskClicked = () => {
      const to = {
        name: "projects.project_id.tasks.index.task_id",
        params: {
          project_id: props.task.project_id,
          task_id: props.task.id
        }
      };
      ipcRenderer.send("route:push", { route: to });
    };

    return { currentStatus, currentPriority, hasDependency, taskClicked };
  }
});
</script>
