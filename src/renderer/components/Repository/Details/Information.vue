<template>
  <table class="table is-narrow">
    <tbody>
      <tr>
        <td>Name</td>
        <td>{{ repository.name }}</td>
      </tr>
      <tr>
        <td>Repository</td>
        <td>{{ repository.repository }}</td>
      </tr>
      <tr>
        <td>Owner</td>
        <td>{{ repository.owner }}</td>
      </tr>
      <tr>
        <td>Sync Frequency</td>
        <td>{{ syncFrequency.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import Repository from '~/models/Repository'

export default defineComponent({
  name: 'Information',
  props: {
    repository: {
      type: Repository,
      required: true
    }
  },
  setup (props, { root }) {
    const syncFrequency = computed(() =>
      Repository.syncFrequencyList().find(
        s => s.value === props.repository.sync_frequency
      )
    )

    return { syncFrequency }
  }
})
</script>
