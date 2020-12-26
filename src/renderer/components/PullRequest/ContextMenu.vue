<template>
  <context-menu-comp ref="contextMenu">
    <b-dropdown-item aria-role="listitem" @click="openPullRequestInGitHub">
      Open
    </b-dropdown-item>
    <b-dropdown-item aria-role="listitem" @click="sync">Sync</b-dropdown-item>
    <b-dropdown-item
      aria-role="listitem"
      class="has-text-danger"
      @click="deletePullRequestConfirm"
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
import PullRequest from "~/models/PullRequest";
import Helpers from "~/plugins/helpers";
import Repository from "~/models/Repository";

export default defineComponent({
  name: "ContextMenu",
  components: { ContextMenuComp },
  props: {
    pullRequest: {
      type: PullRequest,
      required: true,
    },
  },
  setup(props) {
    const deletePullRequestConfirm = () => {
      Dialog.confirm({
        title: "Delete Pull Request",
        message: `You're about to delete <strong>${props.pullRequest.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deletePullRequest(),
      });
    };

    const deletePullRequest = async () => {
      await props.pullRequest.$delete().then(() => {
        Snackbar.open("Pull request deleted.");
      });
    };

    const sync = async () => {
      await props.pullRequest
        .sync()
        .then(() => {
          Snackbar.open("Pull request synced.");
        })
        .catch((err) => {
          console.error(err);
          Snackbar.open({
            duration: 8000,
            message: `Pull request sync failed: ${err.toString()}`,
            type: "is-danger",
            actionText: "Retry",
            onAction: () => {
              sync();
            },
          });
        });
    };

    const openPullRequestInGitHub = async () => {
      const repository = Repository.find(props.pullRequest.repository_id);
      /* eslint-disable max-len */
      const url = `https://github.com/${repository.owner}/${repository.repository}/pull/${props.pullRequest.pull_number}/`;
      Helpers.openLinkInBrowser(url);
    };

    return { deletePullRequestConfirm, sync, openPullRequestInGitHub };
  },
});
</script>
