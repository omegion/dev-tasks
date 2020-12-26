<template>
  <b-dropdown ref="dropdown" append-to-body aria-role="list" class="is-block">
    <slot />
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "ContextMenu",
  setup() {
    const dropdown = ref(null);

    const toggle = (event) => {
      dropdown.value.toggle();
      dropdown.value.$refs.dropdownMenu.style.top = `${event.y}px`;
      dropdown.value.$refs.dropdownMenu.style.left = `${event.x}px`;
    };

    return { dropdown, toggle };
  },
});
</script>
