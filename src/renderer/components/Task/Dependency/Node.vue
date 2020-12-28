<template>
  <section :class="['task-node', task.status, { 'first-node': firstNode }]">
    <div class="marker" />
    <node-list-item v-if="mini && !isSelf" :task="task" />
    <node-item v-if="!mini" :task="task" />
    <div v-if="task.dependencies.length > 0" :class="['task-nodes', miniClass]">
      <Node
        v-for="(dependency, index) in task.dependencies"
        :key="index"
        :task="dependency"
        :mini="mini"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Task from '~/models/Task'
import NodeItem from '~/components/Task/Dependency/NodeItem.vue'
import NodeListItem from '~/components/Task/Dependency/NodeListItem.vue'

export default defineComponent({
  name: 'Node',
  components: {
    NodeItem,
    NodeListItem
  },
  props: {
    task: {
      type: Task,
      required: true
    },
    mini: {
      type: Boolean,
      required: false
    },
    firstNode: {
      type: Boolean,
      required: false
    }
  },
  setup (props, { root }) {
    const miniClass = computed(() => {
      if (props.mini) {
        return 'mini'
      }
      return ''
    })

    const isSelf = computed(() => {
      if (props.task.$id === root.$route.params.task_id) {
        return true
      }
      return false
    })

    return { miniClass, isSelf }
  }
})
</script>
