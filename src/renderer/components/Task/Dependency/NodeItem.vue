<template>
  <section :class="['task-node-item', task.status]">
    <div class="card">
      <div class="card-header is-pulled-right">
        <div class="task-node-delete px-2 py-2">
          <delete :task="task" />
        </div>
      </div>
      <div class="card-content">
        <b-tooltip
          :label="task.name"
          type="is-white"
          position="is-bottom"
          size="is-medium"
          multilined
          :active="isTooltipActive"
        >
          <NuxtLink
            tag="a"
            class="list-title has-text-black has-text-weight-semibold"
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

        <p class="is-size-7 has-text-grey">
          updated {{ task.updatedAt | humanize }}
        </p>
        <!--        <b-button @click="removeParent" size="is-small">Delete</b-button>-->
      </div>
    </div>
    <div class="task-node-add">
      <add :task="task" />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Task from '~/models/Task'
import Add from '~/components/Task/Dependency/Add.vue'
import Delete from '~/components/Task/Dependency/Delete.vue'

export default defineComponent({
  name: 'NodeItem',
  components: { Add, Delete },
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

    return { removeParent, isTooltipActive }
  }
})
</script>
