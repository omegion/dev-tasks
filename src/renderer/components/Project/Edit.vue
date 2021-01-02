<template>
  <section>
    <slot />
    <b-sidebar
      v-model="showModal"
      type="is-white"
      :fullheight="true"
      :can-cancel="['escape']"
      :overlay="true"
      :right="true"
      class="is-medium is-right"
    >
      <ValidationObserver
        v-if="showModal"
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
            <b-input v-model="project.name" />
          </b-field>
        </ValidationProvider>
        <b-field label="Description">
          <b-input v-model="project.description" />
        </b-field>
        <b-field label="Icon">
          <b-dropdown
            v-model="project.icon"
            scrollable
            aria-role="list"
            class="is-small"
          >
            <button slot="trigger" class="button" type="button">
              <template>
                <b-icon :icon="project.icon" />
              </template>
              <b-icon icon="menu-down" />
            </button>
            <b-dropdown-item
              v-for="(icon, index) in iconList"
              :key="index"
              :value="icon"
              aria-role="listitem"
              @click="setIcon(icon)"
            >
              <b-icon :icon="icon" />
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
        <div class="footer">
          <div class="buttons">
            <b-button
              type="is-primary"
              :loading="saveButtonLoading"
              @click="handleSubmit(updateProject)"
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
  name: "ProjectEdit",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  setup(props, { root }) {
    const showModal = ref(false);
    const keyword = ref("");
    const types = ref(["is-primary", "is-danger", "is-success", "is-light"]);
    const saveButtonLoading = ref(false);

    const toggle = () => {
      showModal.value = !showModal.value;
    };

    const project = computed(() => Project.find(root.$route.params.project_id));

    const iconList = computed(() => Project.iconList());

    const updateProject = async (closeSidebar = true) => {
      saveButtonLoading.value = true;
      await Project.update({
        where: project.value.$id,
        data: {
          name: project.value.name,
          description: project.value.description,
          icon: project.value.icon
        }
      }).finally(async () => {
        await Helpers.delay(200);
        saveButtonLoading.value = false;
        if (closeSidebar) {
          toggle();
        }
      });
    };
    const setIcon = async icon => {
      project.value.icon = icon;
      await updateProject(false);
    };

    return {
      showModal,
      project,
      keyword,
      types,
      saveButtonLoading,
      iconList,
      toggle,
      updateProject,
      setIcon
    };
  }
});
</script>
