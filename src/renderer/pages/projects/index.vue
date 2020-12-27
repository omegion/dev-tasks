<template>
  <section />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Index',
  middleware: 'redirect-default-project',
  setup (props, { root }) {
    return {}
  }
})
</script>
