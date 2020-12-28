<template>
  <b-dropdown v-model="selected" aria-role="list">
    <div slot="trigger" class="">
      <template>
        <b-tag :type="currentStatus.type" class="is-cursor-pointer">
          {{ currentStatus.name }}
        </b-tag>
      </template>
    </div>
    <b-dropdown-item v-for="(status, index) in statusList" :key="index" :value="status.slug" aria-role="listitem">
      <div class="media">
        <div class="media-left pt-1">
          <b-icon icon="circle" size="is-small" :type="status.type" />
        </div>
        <div class="media-content">
          <p class="has-text-weight-bold mt-1">{{ status.name }}</p>
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
  name: 'StatusDropdown',
  components: { ProjectEdit },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    const selected = computed({
      get: () => currentStatus.value.slug,
      set: value => {
        setEstimation(value)
        // @ts-ignore
        props.task.status = value
        props.task.updatedAt = moment().toDate().toISOString()
        props.task.$save()
      }
    })
    const statusList = computed(() => Task.statusList())
    const currentStatus = computed(() => statusList.value.find(s => s.slug === props.task.status))

    const setEstimation = value => {
      if (value === 'in_progress' && props.task.status !== 'in_progress') {
        props.task.startedAt = moment().toDate().toISOString()
        props.task.endedAt = null
      } else if (value === 'done') {
        props.task.endedAt = moment().toDate().toISOString()
      }
    }

    return { selected, statusList, currentStatus }
  }
})
</script>
