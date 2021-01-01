<template>
  <div class="">
    <task-list-header v-model="keyword" :tags.sync="tags" />
    <div class="task-list">
      <b-table :data="tasks" :hoverable="true" :mobile-cards="false">
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import Task from "~/models/Task";
import TaskListItem from "~/components/Task/List/ItemForTray.vue";
import TaskListHeader from "~/components/Task/List/Header/Header.vue";
import TaskListFooter from "~/components/Task/List/Footer/Footer.vue";

const LIMIT_INCREASE_NUMBER = 10;

export default defineComponent({
  name: "Tray",
  layout: "tray",
  components: { TaskListItem, TaskListHeader, TaskListFooter },
  setup() {
    const keyword = ref(null);
    const tags = ref([]);
    const limit = ref(LIMIT_INCREASE_NUMBER);

    const tasks = computed(() => {
      let tasks = Task.query();

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
        .orderBy("updatedAt", "desc")
        .limit(limit.value)
        .get();
    });

    const showLoadMoreButton = computed(() => {
      const tasksCount = Task.query().count();
      return tasksCount > limit.value;
    });

    const increaseLimit = () => {
      limit.value = limit.value + LIMIT_INCREASE_NUMBER;
    };

    return { keyword, tags, tasks, showLoadMoreButton, increaseLimit };
  }
});
</script>
