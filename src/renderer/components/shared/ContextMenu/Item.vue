<template>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ContextMenu',
  props: {
    tags: {
      type: Array,
      default: ''
    }
  },
  setup (props, { emit }) {
    const keyword = ref(' ')

    return { keyword }
  }
})
</script>
