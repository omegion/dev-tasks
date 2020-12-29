<template>
  <div class="task-sidebar">
    <div class="sidebar-item">
      <b-field label="Status" />
      <task-status :task="task" />
    </div>
    <div class="sidebar-item">
      <b-field label="Priority" />
      <task-priority :task="task" />
    </div>
    <div class="sidebar-item">
      <estimate :task="task" />
    </div>
    <div v-if="hasPullRequest" class="sidebar-item">
      <pull-requests :pull-requests="task.pull_requests" />
    </div>
    <div v-show="hasDependency" class="sidebar-item">
      <dependency :task="task" />
    </div>
    <div class="sidebar-item">
      <task-tags :tags="task.tags" />
    </div>
    <div class="sidebar-item">
      <time-tracking :task="task" />
    </div>
    <div class="sidebar-item">
      <hr />
      <task-footer :created-at="task.createdAt" :updated-at="task.updatedAt" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import TaskFooter from "~/components/Task/Details/Sidebar/Footer.vue";
import TaskStatus from "~/components/Task/Details/Sidebar/Status.vue";
import TaskPriority from "~/components/Task/Details/Sidebar/Priority.vue";
import TaskTags from "~/components/Task/Details/Sidebar/Tags.vue";
import Dependency from "~/components/Task/Details/Sidebar/Dependency.vue";
import Estimate from "~/components/Task/Details/Sidebar/Estimate.vue";
import TimeTracking from "~/components/Task/Details/Sidebar/TimeTracking.vue";
import PullRequests from "~/components/Task/Details/Sidebar/PullRequests.vue";
import Task from "~/models/Task";

export default defineComponent({
  name: "Sidebar",
  components: {
    Dependency,
    TaskFooter,
    TaskStatus,
    TaskPriority,
    TaskTags,
    PullRequests,
    Estimate,
    TimeTracking
  },
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props, { root }) {
    const hasDependency = computed(() => props.task.dependencies.length > 0);
    const hasPullRequest = computed(() => props.task.pull_requests.length > 0);
    return { hasDependency, hasPullRequest };
  }
});
</script>
