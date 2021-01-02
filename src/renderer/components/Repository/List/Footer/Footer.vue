<template>
  <footer class="repository-list-footer has-text-centered px-4">
    <create ref="repositoryCreate">
      <b-button
        class="mt-3"
        type="is-primary"
        expanded
        icon-left="plus"
        @click="$refs.repositoryCreate.toggle()"
      >
        Add Repository
      </b-button>
    </create>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Create from "~/components/Repository/Create.vue";

export default defineComponent({
  name: "Footer",
  components: { Create }
});
</script>
