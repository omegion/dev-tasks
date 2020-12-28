<template>
  <div>
    <context-menu v-if="isCurrentRoute" ref="menuItem" :project="project" />
    <b-menu-item
      :label="project.name"
      :icon="project.icon"
      tag="NuxtLink"
      :to="{
        name: 'projects.project_id.tasks',
        params: { project_id: project.id },
      }"
      @click="openProject(project.id)"
      @contextmenu.native="toggleContextMenu"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import ProjectEdit from '~/components/Project/Edit.vue'
import Project from '~/models/Project'
import ContextMenu from '~/components/Project/ContextMenu.vue'

export default defineComponent({
  name: 'MenuList',
  components: { ProjectEdit, ContextMenu },
  props: {
    project: {
      type: Project,
      required: true
    }
  },
  setup (props, { root }) {
    const menuItem = ref()

    const { params } = useContext()

    const isCurrentRoute = computed(() => {
      return params.value.project_id === props.project.$id
    })

    const openProject = projectId => {
      root.$router.push({
        name: 'projects.project_id.tasks',
        params: { projectId }
      })
    }

    const toggleContextMenu = event => {
      if (typeof menuItem.value !== 'undefined' && menuItem.value !== null) {
        menuItem.value.$refs.contextMenu.toggle(event)
      }
    }

    return { menuItem, isCurrentRoute, openProject, toggleContextMenu }
  }
})
</script>
