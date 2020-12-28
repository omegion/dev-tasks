<template>
  <b-tooltip
    label="Delete dependency"
    type="is-white"
    position="is-bottom"
    :active="false"
  >
    <button class="delete" @click="removeDependency" />
  </b-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Task from '~/models/Task'
import Node from '~/components/Task/Dependency/Node.vue'

export default defineComponent({
  name: 'Delete',
  components: {
    Node
  },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    const removeDependency = () => {
      Task.update({
        where: props.task.$id,
        data: {
          parent_id: null
        }
      })
    }

    return {
      removeDependency
    }
  }
})
</script>
