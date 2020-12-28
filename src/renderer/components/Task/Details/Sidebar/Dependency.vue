<template>
  <section>
    <b-field :addons="false">
      <template slot="label">
        <dependency-map ref="tagsEdit" :task="task">
          <a @click="$refs.tagsEdit.toggle()">Dependency</a>
        </dependency-map>
      </template>
      <dependency-list :task="task" />
    </b-field>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import DependencyMap from '~/components/Task/Dependency/Map.vue'
import DependencyList from '~/components/Task/Dependency/List.vue'
import Task from '~/models/Task'

export default defineComponent({
  name: 'Dependency',
  components: { DependencyMap, DependencyList },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    return {}
  }
})
</script>
