<template>
  <footer class="repository-list-footer has-text-centered px-4">
    <b-button
      class="mt-3"
      type="is-primary"
      expanded
      :loading="saveButtonLoading"
      icon-left="plus"
      @click="addRepository"
    >
      Add Repository
    </b-button>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Helpers from '~/plugins/helpers'
import Repository from '~/models/Repository'

export default defineComponent({
  name: 'Footer',
  components: {},
  setup (props, { root }) {
    const saveButtonLoading = ref(false)

    const addRepository = async () => {
      saveButtonLoading.value = true

      await Repository.insertDefault()

      await Helpers.delay(200)
      saveButtonLoading.value = false
    }

    return { saveButtonLoading, addRepository }
  }
})
</script>
