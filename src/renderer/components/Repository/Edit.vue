<template>
  <section>
    <slot />
    <b-sidebar
      v-model="showModal"
      type="is-white"
      :fullheight="true"
      :overlay="true"
      :right="true"
      :can-cancel="['escape']"
      class="is-large"
    >
      <ValidationObserver
        ref="observer"
        v-slot="{ handleSubmit }"
        class="section"
      >
        <ValidationProvider v-slot="{ errors }" rules="required" name="Name">
          <b-field
            label="Name"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="repository.name" />
          </b-field>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          name="Repository"
        >
          <b-field
            label="Repository"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="repository.repository" />
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" rules="required" name="Owner">
          <b-field
            label="Owner"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="repository.owner" />
          </b-field>
        </ValidationProvider>
        <b-field label="Token">
          <b-input v-model="repository.token" type="password" password-reveal />
        </b-field>
        <b-field label="Sync Frequency">
          <b-radio-button
            v-for="(frequency, index) in syncFrequencyList"
            :key="index"
            v-model="repository.sync_frequency"
            :native-value="frequency.value"
            size="is-small"
          >
            <span>{{ frequency.name }}</span>
          </b-radio-button>
        </b-field>
        <div class="footer">
          <div class="buttons">
            <b-button
              type="is-primary"
              :loading="saveButtonLoading"
              @click="handleSubmit(updateRepository)"
            >
              Save
            </b-button>
            <b-button @click="toggle">Cancel</b-button>
          </div>
        </div>
      </ValidationObserver>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate/dist/vee-validate.full'

import Helpers from '~/plugins/helpers'
import Repository from '~/models/Repository'

export default defineComponent({
  name: 'Edit',
  components: { ValidationObserver, ValidationProvider },
  props: {
    repository: {
      type: Object,
      required: true
    }
  },
  setup (props, { root }) {
    const showModal = ref(false)
    const saveButtonLoading = ref(false)

    const syncFrequencyList = computed(() => Repository.syncFrequencyList())

    const toggle = () => {
      showModal.value = !showModal.value
    }

    const updateRepository = async (closeSidebar = true) => {
      saveButtonLoading.value = true
      await Repository.update({
        where: props.repository.$id,
        data: {
          name: props.repository.name,
          repository: props.repository.repository,
          owner: props.repository.owner,
          token: props.repository.token,
          sync_frequency: props.repository.sync_frequency
        }
      }).finally(async () => {
        await Helpers.delay(200)
        saveButtonLoading.value = false
        if (closeSidebar) {
          toggle()
        }
      })
    }

    return {
      showModal,
      saveButtonLoading,
      syncFrequencyList,
      toggle,
      updateRepository
    }
  }
})
</script>
