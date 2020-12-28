<template>
  <section>
    <task-list-header v-model="keyword" :tags.sync="tags" />
    <div class="task-list">
      <b-table
        :data="tasks"
        :row-class="(row, index) => row.id === routeTaskId && 'is-selected'"
        :hoverable="true"
      >
        <b-table-column v-slot="props" field="name">
          <task-list-item :task="props.row" />
        </b-table-column>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-confused-outline" size="is-medium" />
              </p>
              <p>No task found.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
    <task-list-footer />
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
import TaskListItem from "~/components/Task/List/Item.vue";
import TaskListHeader from "~/components/Task/List/Header/Header.vue";
import TaskListFooter from "~/components/Task/List/Footer/Footer.vue";

export default defineComponent({
  name: "List",
  components: {
    TaskListItem,
    TaskListHeader,
    TaskListFooter
  },
  setup(props, { root }) {
    const keyword = ref(null);
    const tags = ref([]);

    const { params } = useContext();

    const tasks = computed(() => {
      let tasks = Task.query().where("project_id", params.value.project_id);

      if (keyword.value != null && keyword.value !== "") {
        // @ts-ignore
        tasks = tasks.search(keyword.value);
      }

      if (tags.value.length > 0) {
        tasks = tasks.whereHas("tags", query => {
          query.whereIdIn(tags.value);
        });
      }

      return tasks
        .orderBy("priority", "desc")
        .orderBy("updatedAt", "desc")
        .get();
    });

    const routeTaskId = () => {
      return root.$route.params.task_id;
    };

    return { keyword, tags, routeTaskId, tasks, params };
  }
});
</script>
