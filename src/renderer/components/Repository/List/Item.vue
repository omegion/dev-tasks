<template>
  <div>
    <context-menu ref="menu" :repository="repository" />
    <NuxtLink
      tag="div"
      class="card has-no-shadow has-background-transparent"
      :to="{
        name: 'repositories.index.repository_id',
        params: {
          repository_id: repository.id
        }
      }"
      @contextmenu.native="$refs.menu.$refs.contextMenu.toggle"
    >
      <div class="card has-no-shadow has-background-transparent">
        <div class="card-content p-4">
          <p class="list-title has-text-weight-semibold">
            {{ repository.name }}
          </p>
          <p class="is-size-7">
            {{ repository.repository }}
          </p>
          <p class="pt-2">
            <b-tag>{{ repository.owner }}</b-tag>
          </p>
          <p class="pt-2">{{ repository.description }}</p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Repository from "~/models/Repository.ts";
import ContextMenu from "~/components/Repository/List/ContextMenu.vue";

export default defineComponent({
  name: "Item",
  components: { ContextMenu },
  props: {
    repository: {
      type: Repository,
      required: true
    }
  },
  setup(props, { root }) {
    return {};
  }
});
</script>
