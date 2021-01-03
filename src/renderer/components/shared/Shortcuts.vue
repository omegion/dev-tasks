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
      <div class="section">
        <p class="is-size-6 pb-5">Keyboard Shortcuts</p>
        <div v-for="(component, i) in list" :key="i" class="pb-6">
          <div
            v-for="(shortcut, j) in component.shortcuts"
            :key="j"
            class="media"
          >
            <div class="media-content">{{ shortcut.name }}</div>
            <div class="media-right">
              <code>{{ shortcut.shortcut }}</code>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="buttons">
            <b-button @click="toggle">Cancel</b-button>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from "@nuxtjs/composition-api";
import {
  ValidationObserver,
  ValidationProvider
} from "vee-validate/dist/vee-validate.full";

import Helpers from "~/plugins/helpers";
import Project from "~/models/Project";

export default defineComponent({
  name: "Shortcuts",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  setup(props, { root }) {
    const showModal = ref(false);
    const list = ref([
      {
        name: "Task",
        shortcuts: [{ name: "New Task", shortcut: "⌘/ctrl + N" }]
      },
      {
        name: "Project",
        shortcuts: [{ name: "New Project", shortcut: "⌘/ctrl + P" }]
      },
      {
        name: "Repository",
        shortcuts: [{ name: "New Repository", shortcut: "⌘/ctrl + R" }]
      }
    ]);

    const toggle = () => {
      showModal.value = !showModal.value;
    };

    onMounted(() => {
      root.$emitter.on("shortcuts:show", e => {
        toggle();
      });
    });

    return {
      showModal,
      list,
      toggle
    };
  }
});
</script>
