<template>
  <context-menu-comp ref="contextMenu">
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
import { defineComponent } from "@nuxtjs/composition-api";
import ContextMenuComp from "@/components/shared/ContextMenu/ContextMenu.vue";
import {
  DialogProgrammatic as Dialog,
  SnackbarProgrammatic as Snackbar,
} from "buefy";
import Task from "~/models/Task.ts";

export default defineComponent({
  name: "ContextMenu",
  components: { ContextMenuComp },
  props: {
    task: {
      type: Task,
      required: true,
    },
  },
  setup(props, { root }) {
    const deleteTaskConfirm = () => {
      Dialog.confirm({
        title: "Delete Task",
        message: `You're about to delete <strong>${props.task.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deleteTask(),
      });
    };

    const deleteTask = async () => {
      await props.task.deleteWithRelations().then(() => {
        Snackbar.open("Task deleted.");
      });
    };

    return { deleteTaskConfirm };
  },
});
</script>
