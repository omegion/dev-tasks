<template>
  <section>
    <slot />
    <b-sidebar
      v-model="showModal"
      type="is-white"
      :fullheight="true"
      :overlay="true"
      :right="true"
      class="is-large is-right"
    >
      <ValidationObserver
        ref="observer"
        v-slot="{ handleSubmit }"
        class="section"
      >
        <p class="pb-5">Add a GitHub repository to track your pull requests.</p>
        <ValidationProvider v-slot="{ errors }" rules="required" name="Name">
          <b-field
            label="Name"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="name" />
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
            <b-input v-model="repository" />
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" rules="required" name="Owner">
          <b-field
            label="Owner"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="owner" />
          </b-field>
        </ValidationProvider>
        <b-field label="Token">
          <b-input v-model="token" type="password" password-reveal />
        </b-field>
        <b-field label="Sync Frequency">
          <b-radio-button
            v-for="(frequency, index) in syncFrequencyList"
            :key="index"
            v-model="sync_frequency"
            :native-value="frequency.value"
            size="is-small"
          >
            <span>{{ frequency.name }}</span>
          </b-radio-button>
        </b-field>

        <div class="footer">
          <div class="buttons">
            <b-button
              :loading="saveButtonLoading"
              type="is-primary"
              @click="handleSubmit(createRepository)"
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
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import {
  ValidationObserver,
  ValidationProvider
} from "vee-validate/dist/vee-validate.full";

import Helpers from "~/plugins/helpers";
import Repository from "~/models/Repository";

export default defineComponent({
  name: "Create",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  setup(props, { root }) {
    const showModal = ref(false);
    const name = ref(null);
    const repository = ref(null);
    const owner = ref(null);
    const token = ref("");
    const sync_frequency = ref(0);
    const saveButtonLoading = ref(false);

    const syncFrequencyList = computed(() => Repository.syncFrequencyList());

    const resetForm = () => {
      name.value = null;
      repository.value = null;
      owner.value = null;
      token.value = "";
      sync_frequency.value = 0;
    };

    const toggle = () => {
      resetForm();
      showModal.value = !showModal.value;
    };

    const createRepository = async () => {
      saveButtonLoading.value = true;
      await Repository.insert({
        data: {
          name: name.value,
          repository: repository.value,
          owner: owner.value,
          token: token.value,
          sync_frequency: sync_frequency.value
        }
      }).then(async resp => {
        await Helpers.delay(200);
        root.$router.push({
          name: "repositories.index.repository_id",
          params: { repository_id: resp.repositories[0].$id }
        });
        saveButtonLoading.value = false;
        toggle();
      });
    };

    const illustration = computed(() => Helpers.getIllustration("071"));

    return {
      showModal,
      name,
      repository,
      owner,
      token,
      sync_frequency,
      saveButtonLoading,
      illustration,
      syncFrequencyList,
      toggle,
      createRepository
    };
  }
});
</script>
