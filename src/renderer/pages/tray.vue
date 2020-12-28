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
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from "@nuxtjs/composition-api";
import Task from "~/models/Task";
import TaskListItem from "~/components/Task/List/ItemForTray.vue";
import TaskListHeader from "~/components/Task/List/Header/Header.vue";
import TaskListFooter from "~/components/Task/List/Footer/Footer.vue";

export default defineComponent({
  name: "Tray",
  layout: "tray",
  components: { TaskListItem, TaskListHeader, TaskListFooter },
  setup() {
    const keyword = ref(null);
    const tags = ref([]);

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
        .limit(20)
        .get();
    });

    const makeTransparent = () => {
      document.body.className = "is-transparent";
    };

    onMounted(() => {
      makeTransparent();
    });

    return { keyword, tags, tasks };
  }
});
</script>
