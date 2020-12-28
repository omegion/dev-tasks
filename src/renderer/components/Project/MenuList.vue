<template>
  <section>
    <div v-for="(project, index) in projects" :key="index">
      <menu-list-item :project="project" />
    </div>
    <project-create ref="projectCreate">
      <b-menu-item
        icon="plus"
        label="New Project"
        @click="$refs.projectCreate.toggle()"
      />
    </project-create>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import ProjectEdit from '~/components/Project/Edit.vue'
import Project from '~/models/Project'
import ContextMenu from '~/components/Project/ContextMenu.vue'
import ProjectCreate from '~/components/Project/Create.vue'
import MenuListItem from '~/components/Project/MenuListItem.vue'

export default defineComponent({
  name: 'MenuList',
  components: { ProjectEdit, ContextMenu, ProjectCreate, MenuListItem },
  setup (props, { root }) {
    const projects = computed(() => Project.query().all())

    return { projects }
  }
})
</script>
