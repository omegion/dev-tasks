<template>
  <context-menu-comp ref="contextMenu">
    <b-dropdown-item
      aria-role="listitem"
      @click="$refs.repositoryEdit.toggle()"
    >
      <edit ref="repositoryEdit" :repository="repository">Edit</edit>
    </b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      class="has-text-danger"
      @click="deleteRepositoryConfirm"
    >
      Delete
    </b-dropdown-item>
  </context-menu-comp>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import {
  DialogProgrammatic as Dialog,
  SnackbarProgrammatic as Snackbar,
} from "buefy";
import ContextMenuComp from "~/components/shared/ContextMenu/ContextMenu.vue";
import Edit from "~/components/Repository/Edit.vue";
import Repository from "~/models/Repository.ts";
import PullRequest from "~/models/PullRequest.ts";

export default defineComponent({
  name: "ContextMenu",
  components: { ContextMenuComp, Edit },
  props: {
    repository: {
      type: Repository,
      required: true,
    },
  },
  setup(props, { root }) {
    const deleteRepositoryConfirm = () => {
      Dialog.confirm({
        title: "Delete Repository",
        message: `You're about to delete <strong>${props.repository.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deleteRepository(),
      });
    };

    const deleteRepository = async () => {
      await PullRequest.delete(
        (pull) => pull.repository_id === props.repository.id
      );
      await Repository.delete(props.repository.$id).then(() => {
        Snackbar.open("Repository deleted.");
      });
    };

    return { deleteRepositoryConfirm };
  },
});
</script>
