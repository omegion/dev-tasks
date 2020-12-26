<template>
  <div>
    <div class="media">
      <div class="media-content">
        <b-input
          v-model="keyword"
          icon="magnify"
          placeholder="Search in repositories..."
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'Search',
  components: {},
  props: {
    value: {
      type: String,
      default: ' '
    }
  },
  setup (props, { emit }) {
    const keyword = ref(null)

    const emitKeyword = debounce(value => {
      emit('input', value)
    }, 100)

    watch(keyword, emitKeyword)

    return { keyword }
  }
})
</script>
