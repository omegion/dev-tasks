<template>
  <section class="section py-3 px-3 task-list-header">
    <search v-model="keyword" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import Search from '~/components/Repository/Search/Search.vue'

export default defineComponent({
  name: 'Header',
  components: { Search },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const keyword = ref(null)

    const emitKeyword = value => {
      emit('input', value)
    }

    watch(keyword, emitKeyword)

    return { keyword }
  }
})
</script>
