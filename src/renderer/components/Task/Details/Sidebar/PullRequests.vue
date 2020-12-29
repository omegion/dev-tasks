<template>
  <section>
    <b-field label="Pull Requests">
      <ul>
        <li v-for="(pull, index) in pullRequests" :key="index">
          <pull-request-item :pull-request="pull" />
        </li>
      </ul>
    </b-field>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import PullRequestItem from "~/components/PullRequest/ListItem.vue";

export default defineComponent({
  name: "PullRequests",
  components: { PullRequestItem },
  props: {
    pullRequests: {
      type: Array,
      required: true
    }
  },
  setup(props, { root }) {
    return {};
  }
});
</script>
