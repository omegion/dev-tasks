<template>
  <section>
    <b-tabs
      value="0"
      type="is-boxed"
      :animated="false"
      destroy-on-hide
      class="repository-tabs"
    >
      <b-tab-item value="0">
        <template #header>
          <b-icon icon="information-outline" />
          <span> Details</span>
        </template>
        <div class="columns">
          <div class="column">
            <information :repository="repository" />
          </div>
        </div>
      </b-tab-item>
      <b-tab-item value="1">
        <template #header>
          <b-icon icon="source-pull" />
          <span>
            Pull Requests
            <b-tag v-if="pullRequestsCount" rounded>
              <span class="has-text-weight-medium">{{
                pullRequestsCount
              }}</span>
            </b-tag>
          </span>
        </template>
        <pull-request-list :repository="repository" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Repository from '~/models/Repository'
import Information from '~/components/Repository/Details/Information.vue'
import PullRequestList from '~/components/Repository/Details/PullRequestList.vue'

export default defineComponent({
  name: 'Details',
  components: {
    PullRequestList,
    Information
  },
  props: {
    repository: {
      type: Repository,
      required: true
    }
  },
  setup (props, { root }) {
    const pullRequestsCount = computed(
      () => props.repository.pull_requests.length
    )
    return { pullRequestsCount }
  }
})
</script>
