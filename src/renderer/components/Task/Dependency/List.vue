<template>
  <section>
    <div class="task-dependencies">
      <node :task="task" :mini="true" :first-node="true" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Task from '~/models/Task'
import Node from '~/components/Task/Dependency/Node.vue'

export default defineComponent({
  name: 'List',
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
    const taskId = ref(null)

    const addDependency = () => {
      Task.update({
        where: taskId.value,
        data: {
          parent_id: props.task.$id
        }
      })
    }

    return { taskId, addDependency }
  }
})
</script>
