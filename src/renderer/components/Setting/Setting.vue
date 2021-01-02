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
      class="is-medium is-right"
    >
      <div class="section">
        <dark-mode />
        <notification />
        <analytics />
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
import { defineComponent, ref } from "@nuxtjs/composition-api";
import DarkMode from "~/components/Setting/DarkMode.vue";
import Notification from "~/components/Setting/Notification.vue";
import Analytics from "~/components/Setting/Analytics.vue";

export default defineComponent({
  name: "Create",
  components: { DarkMode, Notification, Analytics },
  setup() {
    const showModal = ref(false);
    const saveButtonLoading = ref(false);

    const toggle = () => {
      showModal.value = !showModal.value;
    };

    const save = () => {
      showModal.value = !showModal.value;
    };

    return {
      showModal,
      saveButtonLoading,
      toggle,
      save
    };
  }
});
</script>
