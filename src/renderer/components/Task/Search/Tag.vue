<template>
  <div>
    <b-field label="Tags" />
    <b-taginput
      v-model="selectedTags"
      :data="tags"
      field="name"
      :open-on-focus="true"
      autocomplete
      ellipsis
      icon="label"
      placeholder="Add a tag"
      aria-close-label="Delete this tag"
      :type="inputType"
      rounded
    >
      <template slot="empty"> There are no tags</template>
    </b-taginput>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "@nuxtjs/composition-api";
import TagInput from "~/components/shared/TagInput.vue";
import Tag from "~/models/Tag";
import Setting from "~/models/Setting";

export default defineComponent({
  name: "Tag",
  components: { TagInput },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  setup(props, { emit }) {
    const keyword = ref(" ");
    const selectedTags = ref(null);

    const isDarkMode = computed(
      () => Setting.get("dark_mode", false) === "true"
    );
    const inputType = computed(() => {
      return isDarkMode.value ? "is-dark-light" : "is-light";
    });
    const tags = computed(() => Tag.query().get());

    const emitTags = value => {
      const reducedTags = value.map(tag => tag.id);
      emit("input", reducedTags);
    };

    watch(selectedTags, emitTags);

    return { keyword, tags, selectedTags, inputType };
  }
});
</script>
