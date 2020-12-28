<template>
  <div>
    <b-menu-list label="Project">
      <menu-list />
    </b-menu-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import MenuList from '~/components/Project/MenuList.vue'

export default defineComponent({
  name: 'ProjectMenuList',
  components: { MenuList },
  setup () {
    return {}
  }
})
</script>
