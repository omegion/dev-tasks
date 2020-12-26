<template>
  <section>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min_value:-10"
        name="Estimate"
      >
        <b-field
          label="Estimate"
          :type="{ 'is-danger': errors[0] }"
          :message="errors"
        >
          <b-input
            v-show="showInput"
            ref="inputRef"
            v-model="task.estimate"
            icon-right="check-circle"
            icon-right-clickable
            @icon-right-click="handleSubmit(save)"
            @keyup.enter.native="handleSubmit(save)"
            @keyup.esc.native="handleSubmit(save)"
          />
        </b-field>
      </ValidationProvider>
    </ValidationObserver>
    <span v-show="!showInput" class="pb-3" @click.self="toggleInput">
      {{ task.estimate }} Hours
    </span>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate/dist/vee-validate.full'
import Task from '~/models/Task'

export default defineComponent({
  name: 'Estimate',
  components: { ValidationObserver, ValidationProvider },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup (props, { root }) {
    const observer = ref(null)
    const inputRef = ref(null)
    const showInput = ref(false)

    const estimate = computed({
      get: () => props.task.estimate,
      set: value => {
        save(value)
      }
    })

    const save = async value => {
      await props.task.$save()
      toggleInput()
    }

    const toggleInput = () => {
      showInput.value = !showInput.value
    }

    return { observer, inputRef, showInput, estimate, save, toggleInput }
  }
})
</script>
