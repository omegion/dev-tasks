<template>
  <b-dropdown v-model="selected" aria-role="list">
    <div slot="trigger" class="">
      <template>
        <b-button type="is-white">
          <div class="media">
            <div class="media-left">
              <b-icon :icon="currentPriority.icon" size="is-small" :type="currentPriority.type" />
            </div>
            <div class="media-content">
              <p class="">
                {{ currentPriority.name }}
              </p>
            </div>
          </div>
        </b-button>
      </template>
    </div>
    <b-dropdown-item
      v-for="(priority, index) in priorityList"
      :key="index"
      :value="priority.value"
      aria-role="listitem"
    >
      <div class="media">
        <div class="media-left pt-1">
          <b-icon :icon="priority.icon" size="is-small" :type="priority.type" />
        </div>
        <div class="media-content">
          <p class="has-text-weight-bold mt-1">{{ priority.name }}</p>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import moment from 'moment'
import ProjectEdit from '~/components/Project/Edit.vue'
import Task from '~/models/Task'

export default defineComponent({
  name: 'PriorityDropdown',
  components: { ProjectEdit },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props) {
    const selected = computed({
      get: () => currentPriority.value.value,
      set: value => {
        props.task.priority = value
        props.task.updatedAt = moment().toDate().toISOString()
        props.task.$save()
      }
    })
    const priorityList = computed(() => Task.priorityList())
    const currentPriority = computed(() => priorityList.value.find(s => s.value === props.task.priority))

    return { selected, priorityList, currentPriority }
  }
})
</script>
