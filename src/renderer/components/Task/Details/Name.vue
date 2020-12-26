<template>
  <div>
    <b-input
      v-show="showNameInput"
      ref="nameInputRef"
      v-model="name"
      icon-right="check-circle"
      icon-right-clickable
      @icon-right-click="toggleInput(false)"
      @keyup.enter.native="toggleInput(false)"
      @keyup.esc.native="toggleInput(false)"
    />
    <h3
      v-show="!showNameInput"
      class="is-size-5 has-text-weight-bold has-text-black pb-3"
      @click.self="toggleInput(true)"
    >
      {{ task.name }}
    </h3>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import Task from '@/models/Task'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'Name',
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    const nameInputRef = ref(null)
    const showNameInput = ref(false)

    const name = computed({
      get: () => props.task.name,
      set: debounce(value => {
        save(value)
      }, 500)
    })

    const save = value => {
      props.task.name = value
      props.task.$save()
    }

    const toggleInput = focus => {
      if (focus) {
        nameInputRef.value.focus()
      }
      showNameInput.value = !showNameInput.value
    }

    return {
      nameInputRef,
      name,
      showNameInput,
      save,
      toggleInput
    }
  }
})
</script>
