<template>
  <div>
    <div class="media">
      <div class="media-content">
        <b-input
          v-model="keyword"
          icon="magnify"
          placeholder="Search in tasks..."
        />
      </div>
      <div class="ml-1">
        <b-button icon-left="filter" type="is-text" @click="toggleFilter" />
      </div>
    </div>
    <div v-show="showFilter" class="py-3">
      <tag-search v-model="tags" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import TagInput from '~/components/shared/TagInput.vue'
import TagSearch from '~/components/Task/Search/Tag.vue'

export default defineComponent({
  name: 'Search',
  components: { TagInput, TagSearch },
  props: {
    value: {
      type: String,
      default: ' '
    }
  },
  setup (props, { emit }) {
    const keyword = ref(null)
    const showFilter = ref(false)
    const tags = ref([])

    const emitKeyword = debounce(value => {
      emit('input', value)
    }, 100)

    const emitTags = value => {
      emit('update:tags', value)
    }

    const toggleFilter = () => {
      showFilter.value = !showFilter.value
    }

    watch(keyword, emitKeyword)
    watch(tags, emitTags)

    return { keyword, showFilter, tags, toggleFilter }
  }
})
</script>
