<template>
  <section>
    <task-list-header v-model="keyword" :tags.sync="tags" />
    <div class="task-list" ref="taskListRef">
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
      <div v-if="showLoadMoreButton" class="p-3 has-text-centered">
        <b-button size="is-small" @click="increaseLimit">load more</b-button>
      </div>
    </div>
    <task-list-footer />
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext
} from "@nuxtjs/composition-api";
import Task from "~/models/Task";
import TaskListItem from "~/components/Task/List/Item.vue";
import TaskListHeader from "~/components/Task/List/Header/Header.vue";
import TaskListFooter from "~/components/Task/List/Footer/Footer.vue";
import PerfectScrollbar from "perfect-scrollbar";

const LIMIT_INCREASE_NUMBER = 10;

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
    const limit = ref(LIMIT_INCREASE_NUMBER);
    const taskListRef = ref(null);

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
        .limit(limit.value)
        .get();
    });

    const showLoadMoreButton = computed(() => {
      const tasksCount = Task.query()
        .where("project_id", params.value.project_id)
        .count();
      return tasksCount > limit.value;
    });

    const routeTaskId = () => {
      return root.$route.params.task_id;
    };

    const increaseLimit = () => {
      limit.value = limit.value + LIMIT_INCREASE_NUMBER;
    };

    const perfectScrollBar = () => {
      const ps = new PerfectScrollbar(taskListRef.value, {
        wheelPropagation: true
      });
    };

    onMounted(() => {
      perfectScrollBar();
    });

    return {
      keyword,
      tags,
      taskListRef,
      routeTaskId,
      tasks,
      params,
      increaseLimit,
      showLoadMoreButton
    };
  }
});
</script>
