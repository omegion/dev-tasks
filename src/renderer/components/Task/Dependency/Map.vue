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
      class="is-xlarge"
    >
      <div class="section">
        <div class="task-dependencies">
          <node :task="task" />
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
  defineComponent,
  onMounted,
  ref,
  onUnmounted
} from "@nuxtjs/composition-api";
import Node from "~/components/Task/Dependency/Node.vue";
import Task from "~/models/Task";

export default defineComponent({
  name: "Map",
  components: { Node },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props, { root }) {
    const showModal = ref(false);

    const toggle = () => {
      showModal.value = !showModal.value;
    };

    onMounted(() => {
      root.$emitter.on("toggleDependencyMap", e => {
        toggle();
      });
    });

    onUnmounted(() => {
      root.$emitter.off("toggleDependencyMap", e => {});
    });

    return {
      showModal,
      toggle
    };
  }
});
</script>
