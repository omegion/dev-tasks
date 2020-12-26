<template>
  <context-menu-comp ref="contextMenu">
    <b-dropdown-item aria-role="listitem" @click="$refs.projectEdit.toggle()">
      <project-edit ref="projectEdit">Edit</project-edit>
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      class="has-text-danger"
      @click="deleteProjectConfirm"
    >
      Delete
    </b-dropdown-item>
  </context-menu-comp>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import ContextMenuComp from "~/components/shared/ContextMenu/ContextMenu.vue";
import {
  DialogProgrammatic as Dialog,
  SnackbarProgrammatic as Snackbar,
} from "buefy";
import Project from "~/models/Project";
import ProjectEdit from "~/components/Project/Edit.vue";
import Task from "~/models/Task";

export default defineComponent({
  name: "ContextMenu",
  components: { ContextMenuComp, ProjectEdit },
  props: {
    project: {
      type: Project,
      required: true,
    },
  },
  setup(props, { root }) {
    const deleteProjectConfirm = () => {
      Dialog.confirm({
        title: "Delete Project",
        message: `You're about to delete <strong>${props.project.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deleteProject(),
      });
    };

    const deleteProject = async () => {
      await Task.delete((task) => {
        return task.project_id === props.project.$id;
      });

      await Project.delete(props.project.$id).then(() => {
        Snackbar.open("Project deleted.");
      });
    };
    return { deleteProjectConfirm };
  },
});
</script>
