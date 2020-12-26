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
      class="is-medium"
    >
      <div class="section">
        <p class="pb-5">Create a task for a project.</p>
        <b-field label="Project">
          <b-autocomplete
            v-model="keyword"
            placeholder="e.g. Productivity"
            :open-on-focus="true"
            :data="projects"
            field="name"
            :clearable="true"
            @select="(option) => (selectedProject = option)"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-content">
                  {{ props.option }}
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>
        <b-field label="Title">
          <b-input v-model="name" placeholder="e.g. My task" />
        </b-field>
        <b-field label="Description">
          <b-input v-model="description" placeholder="e.g. Unfinished tasks" />
        </b-field>

        <div class="footer">
          <div class="buttons">
            <b-button
              :loading="saveButtonLoading"
              type="is-primary"
              @click="createProject"
            >
              Save
            </b-button>
            <b-button @click="toggle">Cancel</b-button>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import Helpers from '~/plugins/helpers'
import Project from '~/models/Project'

export default defineComponent({
  name: 'TaskCreate',
  setup (props, { emit }) {
    const showModal = ref(false)
    const keyword = ref('')
    const selectedProject = ref<Project>(null)

    const name = ref('')
    const description = ref('')
    const saveButtonLoading = ref(false)

    const toggle = () => {
      showModal.value = !showModal.value
    }

    const projects = computed(() =>
      Project.query()
        .search(keyword.value, {
          caseSensitive: false,
          threshold: 0.3,
          keys: ['name']
        })
        .get()
    )
    const createProject = async () => {
      saveButtonLoading.value = true
      await Project.insert({
        data: {
          name: name.value
        }
      }).finally(async () => {
        await Helpers.delay(200)
        saveButtonLoading.value = false
      })
    }

    return {
      keyword,
      projects,
      selectedProject,
      showModal,
      name,
      description,
      saveButtonLoading,
      toggle,
      createProject
    }
  }
})
</script>
