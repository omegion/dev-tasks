<template>
  <b-field>
    <template slot="label">
      Analytics
      <p class="is-size-7">Help to improve the application.</p>
    </template>
    <b-switch v-model="analytics" @input="save" />
  </b-field>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Setting from '~/models/Setting'

export default defineComponent({
  name: 'Analytics',
  setup () {
    const analytics = computed({
      get: () => {
        const setting = Setting.get('analytics_enabled')
        if (setting) {
          return setting
        }
        return false
      },
      set: () => {}
    })

    const save = value => {
      Setting.set('analytics_enabled', value)
    }

    return {
      analytics,
      save
    }
  }
})
</script>
