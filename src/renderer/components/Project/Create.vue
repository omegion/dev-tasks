<template>
  <section>
    <slot />
    <b-sidebar
      v-model="showModal"
      type="is-white"
      :fullheight="true"
      :overlay="true"
      :right="true"
      class="is-medium is-right"
    >
      <ValidationObserver
        ref="observer"
        v-slot="{ handleSubmit }"
        class="section"
      >
        <div class="py-3 pl-6 is-illustration is-medium">
          <img :src="illustration" alt="" />
        </div>
        <p class="pb-5">A project is a highest layer on the top of Tasks.</p>
        <ValidationProvider v-slot="{ errors }" rules="required" name="Name">
          <b-field
            label="Name"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="name" placeholder="e.g. First Go Application" />
          </b-field>
        </ValidationProvider>
        <b-field label="Description">
          <b-input v-model="description" placeholder="e.g. Unfinished tasks" />
        </b-field>

        <div class="footer">
          <div class="buttons">
            <b-button
              :loading="saveButtonLoading"
              type="is-primary"
              @click="handleSubmit(createProject)"
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
import Project from "~/models/Project";

export default defineComponent({
  name: "Create",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  setup(props, { root }) {
    const showModal = ref(false);
    const name = ref("");
    const description = ref("");
    const saveButtonLoading = ref(false);

    const resetForm = () => {
      name.value = null;
      description.value = null;
    };

    const toggle = () => {
      resetForm();
      showModal.value = !showModal.value;
    };

    const createProject = async () => {
      saveButtonLoading.value = true;
      await Project.insert({
        data: {
          name: name.value,
          description: description.value
        }
      }).then(async resp => {
        await Helpers.delay(200);
        root.$router.push({
          name: "projects.project_id.tasks",
          params: { project_id: resp.projects[0].$id }
        });
        saveButtonLoading.value = false;
        toggle();
      });
    };

    const illustration = computed(() => Helpers.getIllustration("071"));

    return {
      showModal,
      name,
      description,
      saveButtonLoading,
      illustration,
      toggle,
      createProject
    };
  }
});
</script>
