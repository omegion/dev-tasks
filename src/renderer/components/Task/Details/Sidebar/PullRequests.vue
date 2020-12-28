<template>
  <section>
    <b-field>
      <template slot="label">
        <create ref="create">
          <a @click="$refs.create.toggle()">Pull Requests</a>
        </create>
      </template>
      <ul>
        <li v-for="(pull, index) in pullRequests" :key="index">
          <pull-request-item :pull-request="pull" />
        </li>
      </ul>
    </b-field>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Create from '~/components/PullRequest/Create.vue'
import PullRequestItem from '~/components/PullRequest/ListItem.vue'

export default defineComponent({
  name: 'PullRequests',
  components: { PullRequestItem, Create },
  props: {
    pullRequests: {
      type: Array,
      required: true
    }
  },
  setup (props, { root }) {
    return {}
  }
})
</script>
