<template>
  <section class="section py-3 px-3 task-list-header">
    <search v-model="keyword" :tags.sync="tags" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import Search from '~/components/Task/Search/Search.vue'

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
    const tags = ref([])

    const emitKeyword = value => {
      emit('input', value)
    }

    const emitTags = value => {
      emit('update:tags', value)
    }

    watch(keyword, emitKeyword)
    watch(tags, emitTags)

    return { keyword, tags }
  }
})
</script>
