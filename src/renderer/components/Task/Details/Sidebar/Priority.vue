<template>
  <section>
    <priority-dropdown :task="task" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PriorityDropdown from '~/components/Task/Details/Sidebar/PriorityDropdown.vue'

export default defineComponent({
  name: 'Priority',
  components: { PriorityDropdown },
  props: {
    task: {
      required: true
    }
  },
  setup (props, { root }) {
    return {}
  }
})
</script>
