<template>
  <b-field>
    <template slot="label">
      Notification
      <p class="is-size-7">Application notifications for different actions.</p>
    </template>
    <b-switch v-model="notification" @input="save" />
  </b-field>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Setting from '~/models/Setting'

export default defineComponent({
  name: 'Notification',
  setup () {
    const notification = computed({
      get: () => {
        const setting = Setting.get('notifications_enabled')
        if (setting) {
          return setting
        }
        return false
      },
      set: () => {}
    })

    const save = value => {
      Setting.set('notifications_enabled', value)
    }

    return {
      notification,
      save
    }
  }
})
</script>
