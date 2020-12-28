<template>
  <section :class="['task-node-list-item', task.status]">
    <b-tooltip
      :label="task.name"
      type="is-white"
      position="is-bottom"
      size="is-medium"
      multilined
      :active="isTooltipActive"
    >
      <b-icon size="is-small" icon="circle-medium" :type="currentStatus.type" />
      <NuxtLink
        tag="a"
        class="list-title has-text-black has-text-weight-medium"
        :to="{
          name: 'projects.project_id.tasks.index.task_id',
          params: {
            task_id: task.id,
          },
        }"
      >
        {{ task.name | trim(20) }}
      </NuxtLink>
    </b-tooltip>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Task from '~/models/Task'

export default defineComponent({
  name: 'NodeListItem',
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    const isTooltipActive = computed(() => {
      return props.task.name.length > 20
    })

    const removeParent = () => {
      Task.update({
        where: props.task.$id,
        data: {
          parent_id: null
        }
      })
    }

    const currentStatus = computed(() =>
      Task.statusList().find(s => s.slug === props.task.status)
    )

    return { removeParent, isTooltipActive, currentStatus }
  }
})
</script>
