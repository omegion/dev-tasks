<template>
  <b-table :data="repository.pull_requests" class="pull-request-list">
    <b-table-column v-slot="props" field="name">
      <b-tooltip :label="mergeStateIcon(props.row).text" type="is-white" position="is-bottom">
        <b-icon :icon="mergeStateIcon(props.row).icon" :type="mergeStateIcon(props.row).type" size="is-small" />
      </b-tooltip>
    </b-table-column>
    <b-table-column v-slot="props" field="name">
      {{ props.row.name | trim(50) }}
      <b-tag size="is-small" class="has-text-weight-medium">
        {{ props.row.comments_count }}
      </b-tag>
    </b-table-column>
    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-confused-outline" size="is-medium" />
          </p>
          <p>No pull request found.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Repository from '~/models/Repository'

export default defineComponent({
  name: 'PullRequestList',
  components: {},
  props: {
    repository: {
      type: Repository,
      required: true
    }
  },
  setup () {
    const mergeStateIcon = pullRequest => {
      return pullRequest.mergeStateIcon
    }
    return { mergeStateIcon }
  }
})
</script>
