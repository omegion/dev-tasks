<template>
  <section class="task-list-item">
    <context-menu ref="menu" :task="task" />
    <NuxtLink
      tag="div"
      class="card has-no-shadow has-background-transparent"
      :to="{
        name: 'projects.project_id.tasks.index.task_id',
        params: {
          task_id: task.id
        }
      }"
      @contextmenu.native="$refs.menu.$refs.contextMenu.toggle"
    >
      <div class="card has-no-shadow has-background-transparent">
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
          <p class="pt-2">
            <b-icon
              :icon="currentPriority.icon"
              size="is-small"
              :type="currentPriority.type"
            />
            <b-icon
              v-if="hasDependency"
              icon="file-tree-outline "
              size="is-small"
            />
          </p>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import ContextMenu from "~/components/Task/List/ContextMenu.vue";
import Task from "~/models/Task";

export default defineComponent({
  name: "TaskListItem",
  components: { ContextMenu },
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
    return { currentStatus, currentPriority, hasDependency };
  }
});
</script>
