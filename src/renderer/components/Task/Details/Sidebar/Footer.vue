<template>
  <footer class="is-size-7">
    updated {{ updatedAt | humanize }}
    <div>created {{ createdAt | humanize }}</div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Footer',
  props: {
    updatedAt: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  },
  setup (props, { root }) {
    return {}
  }
})
</script>
