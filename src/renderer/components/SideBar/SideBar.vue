<template>
  <b-sidebar position="static" type="is-light" :reduce="isReduced" open>
    <div class="p-1">
      <div class="block logo">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="require('~/assets/logo.svg')" alt="Dev Tasks">
            </figure>
          </div>
          <div
            v-show="!isReduced"
            class="media-content has-text-weight-bold is-size-4 logo-text"
          >
            Dev Tasks
          </div>
        </div>
      </div>
      <b-menu class="is-custom-mobile">
        <project-menu-list />
        <b-menu-list label="Repository">
          <b-menu-item
            icon="github"
            label="GitHub"
            tag="NuxtLink"
            to="/repositories"
            :active="false"
          />
        </b-menu-list>
      </b-menu>
      <div class="footer">
        <div class="buttons">
          <setting-sidebar ref="setting">
            <b-button
              icon-right="cog-outline"
              type="is-white"
              @click="$refs.setting.toggle()"
            />
          </setting-sidebar>
          <span :class="{ 'pl-2': !isReduced }">
            <b-button
              :icon-right="toggleIcon"
              type="is-white"
              @click="toggle"
            />
          </span>
        </div>
      </div>
    </div>
  </b-sidebar>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import Setting from '~/models/Setting'
import ProjectMenuList from '~/components/SideBar/ProjectMenuList.vue'
import SettingSidebar from '~/components/Setting/Setting.vue'

export default defineComponent({
  name: 'SideBar',
  components: { ProjectMenuList, SettingSidebar },
  setup () {
    const sidebarMini = computed(() => {
      return Setting.query().where('name', 'sidebar_mini').first()
    })

    const toggleIcon = computed(() => {
      if (sidebarMini.value === null || sidebarMini.value.value === 'false') {
        return 'arrow-collapse-right'
      }
      return 'arrow-collapse-left'
    })

    const isReduced = computed(() => {
      return sidebarMini.value === null || sidebarMini.value.value === 'false'
    })

    const toggle = () => {
      const data = {
        name: 'sidebar_mini',
        value: true
      }
      if (sidebarMini.value === null) {
        Setting.insert({
          data
        })
      } else if (sidebarMini.value.value === 'false') {
        Setting.update({
          data
        })
      } else {
        data.value = false
        Setting.update({
          data
        })
      }
    }

    return { sidebarMini, toggleIcon, isReduced, toggle }
  }
})
</script>

<style lang="scss">
.p-1 {
  padding: 1em;
}

.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  // min-height: 100vh;
  .sidebar-layout {
    display: flex;
    flex-direction: row;
    min-height: 100%;
    // min-height: 100vh;
  }
}
</style>
