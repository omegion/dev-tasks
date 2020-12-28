<template>
  <section>
    <status-dropdown :task="task" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import StatusDropdown from '~/components/Task/Details/Sidebar/StatusDropdown.vue'

export default defineComponent({
  name: 'Status',
  components: { StatusDropdown },
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
