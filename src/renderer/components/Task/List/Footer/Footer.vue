<template>
  <footer class="task-list-footer has-text-centered px-4">
    <b-button
      class="mt-3"
      type="is-primary"
      expanded
      :loading="saveButtonLoading"
      icon-left="plus"
      @click="addTask"
    >
      Add Task
    </b-button>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Helpers from '~/plugins/helpers'
import Task from '~/models/Task'

export default defineComponent({
  name: 'Footer',
  components: {},
  setup (props, { root }) {
    const saveButtonLoading = ref(false)

    const addTask = async () => {
      saveButtonLoading.value = true
      await Task.insertDefault(root.$route.params.project_id)
      await Helpers.delay(200)
      saveButtonLoading.value = false
    }

    return { saveButtonLoading, addTask }
  }
})
</script>
