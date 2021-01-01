<template>
  <context-menu-comp ref="contextMenu">
    <b-dropdown-item aria-role="listitem" @click="toggleDependencyMap">
      Add Dependency
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      @click="$refs.addPullRequest.toggle()"
    >
      <add-pull-request ref="addPullRequest">
        Add Pull Request
      </add-pull-request>
    </b-dropdown-item>
    <b-dropdown-item aria-role="listitem" separator />
    <b-dropdown-item
      aria-role="listitem"
      class="has-text-danger"
      @click="deleteTaskConfirm"
    >
      Delete
    </b-dropdown-item>
  </context-menu-comp>
</template>

<script lang="ts">
import { defineComponent, useContext } from "@nuxtjs/composition-api";
import ContextMenuComp from "@/components/shared/ContextMenu/ContextMenu.vue";
import Task from "~/models/Task.ts";
import AddPullRequest from "~/components/PullRequest/Create.vue";
import DependencyMap from "~/components/Task/Dependency/Map.vue";
import mitt from "mitt";

import {
  DialogProgrammatic as Dialog,
  SnackbarProgrammatic as Snackbar
} from "buefy";

const emitter = mitt();

export default defineComponent({
  name: "ContextMenu",
  components: { ContextMenuComp, AddPullRequest, DependencyMap },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props, { root }) {
    const { route } = useContext();

    const deleteTaskConfirm = () => {
      Dialog.confirm({
        title: "Delete Task",
        message: `You're about to delete <strong>${props.task.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deleteTask()
      });
    };

    const deleteTask = async () => {
      await props.task.deleteWithRelations().then(() => {
        Snackbar.open("Task deleted.");
        root.$router.push({
          name: "projects.project_id.tasks",
          params: { project_id: props.task.project_id }
        });
      });
    };

    const toggleDependencyMap = async () => {
      root.$emitter.emit("toggleDependencyMap", { taskId: props.task.id });
    };

    return { deleteTaskConfirm, toggleDependencyMap };
  }
});
</script>
