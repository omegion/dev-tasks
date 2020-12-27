<template>
  <div class="">
    <side-bar />
    <div :class="['main-wrap', { 'sidebar-mini': isSidebarReduced }]">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Setting from '@/models/Setting'
import SideBar from '@/components/SideBar/SideBar.vue'

export default {
  components: { SideBar },
  computed: {
    sidebarMini () {
      return Setting.query().where('name', 'sidebar_mini').first()
    },
    isSidebarReduced () {
      return this.sidebarMini === null || this.sidebarMini.value === 'false'
    }
  }
}
</script>
