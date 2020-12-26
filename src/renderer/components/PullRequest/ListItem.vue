<template>
  <div class="is-cursor-pointer">
    <context-menu ref="pullRequestItem" :pull-request="pullRequest" />
    <div class="media" @contextmenu="toggleContextMenu">
      <div class="media-left mr-1">
        <b-tooltip
          :label="mergeStateIcon.text"
          type="is-white"
          position="is-bottom"
        >
          <b-icon
            :icon="mergeStateIcon.icon"
            :type="mergeStateIcon.type"
            size="is-small"
          />
        </b-tooltip>
      </div>
      <div class="media-content">
        {{ pullRequest.name | trim(35) }}
        <b-tag size="is-small" class="has-text-weight-medium">
          {{ pullRequest.comments_count }}
        </b-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import PullRequest from '~/models/PullRequest'
import ContextMenu from '~/components/PullRequest/ContextMenu.vue'

export default defineComponent({
  name: 'ListItem',
  components: { ContextMenu },
  props: {
    pullRequest: {
      type: PullRequest,
      required: true
    }
  },
  setup (props, { root }) {
    const pullRequestItem = ref()

    const toggleContextMenu = event => {
      pullRequestItem.value.$refs.contextMenu.toggle(event)
    }

    const mergeStateIcon = computed(() => {
      return props.pullRequest.mergeStateIcon
    })

    return { pullRequestItem, mergeStateIcon, toggleContextMenu }
  }
})
</script>
