<template>
  <section>
    <slot />
    <b-dropdown
      ref="dropdownRef"
      position="is-bottom-right"
      append-to-body
      aria-role="menu"
      trap-focus
      :close-on-click="false"
    >
      <b-button slot="trigger" icon-left="plus" rounded size="is-small" />
      <b-dropdown-item
        aria-role="menu-item"
        :focusable="false"
        custom
        paddingless
      >
        <div class="card has-no-shadow" style="width: 300px">
          <div class="card-content">
            <b-field label="Task">
              <b-autocomplete
                v-model="keyword"
                placeholder="search in tasks"
                :open-on-focus="true"
                :data="tasks"
                field="name"
                :clearable="true"
                @select="option => (selectedTask = option)"
              />
            </b-field>
            <div class="pt-3">
              <b-button type="is-primary" expanded @click="addDependency">
                Add
              </b-button>
            </div>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext
} from "@nuxtjs/composition-api";
import Task from "~/models/Task";
import Node from "~/components/Task/Dependency/Node.vue";

export default defineComponent({
  name: "Add",
  components: {
    Node
  },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props, { root }) {
    const dropdownRef = ref(null);
    const keyword = ref(null);
    const selectedTask = ref<Task>(null);
    const taskId = ref(null);
    const showTaskSearchInput = ref(false);

    const { params } = useContext();

    const tasks = computed(() => {
      let q = Task.query()
        .where("parent_id", null)
        .where("project_id", params.value.project_id);

      if (keyword.value !== null && keyword.value !== "") {
        // @ts-ignore
        q = q.search(keyword.value);
      }

      return q.get();
    });

    const toggle = () => {
      showTaskSearchInput.value = !showTaskSearchInput.value;
    };

    const addDependency = () => {
      if (selectedTask.value.$id === props.task.$id) {
        return;
      }
      Task.update({
        where: selectedTask.value.$id,
        data: {
          parent_id: props.task.$id
        }
      });
      dropdownRef.value.toggle();
    };

    return {
      dropdownRef,
      keyword,
      selectedTask,
      tasks,
      taskId,
      showTaskSearchInput,
      toggle,
      addDependency
    };
  }
});
</script>
