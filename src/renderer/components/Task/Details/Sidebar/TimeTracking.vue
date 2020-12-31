<template>
  <section>
    <b-field label="Time Tracking" />
    <div class="media">
      <div class="media-left mr-2">
        <b-icon v-if="isCompleted" icon="check" />
        <b-icon v-else icon="clock-outline" />
      </div>
      <div class="media-content">
        <div class="estimate-progress">
          <div v-if="isOverdue">
            Overdue by {{ overdueTimeInHours.toFixed(1) }}h
          </div>
          <div v-else-if="!isCompleted">
            <b-progress
              :value="progressPercentage"
              size="is-xsmall"
              type="is-primary"
            />
            <span>{{ passedTimeInHours.toFixed(1) }}h passed</span>
            <span class="is-pulled-right"
              >{{ remainingTimeInHours.toFixed(0) }}h</span
            >
          </div>
          <div v-else>completed in {{ completedTimeInHours.toFixed(1) }}h</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from "@nuxtjs/composition-api";
import moment from "moment";
import Task from "~/models/Task";

export default defineComponent({
  name: "TimeTracking",
  components: {},
  props: {
    task: {
      type: Task,
      required: true
    }
  },
  setup(props) {
    const now = ref(moment());

    const passedTimeInHours = computed(() => {
      const startedAt = moment(props.task.startedAt);
      const duration = moment.duration(now.value.diff(startedAt));
      return duration.asHours();
    });

    const remainingTimeInHours = computed(
      () => props.task.estimate - passedTimeInHours.value
    );

    const isCompleted = computed(() => props.task.endedAt !== "null");
    const isOverdue = computed(
      () => remainingTimeInHours.value < 0 && !isCompleted.value
    );
    const progressPercentage = computed(() => {
      if (isCompleted.value || remainingTimeInHours.value < 0) {
        return 100;
      }
      return (passedTimeInHours.value / remainingTimeInHours.value) * 100;
    });

    const completedTimeInHours = computed(() => {
      const startedAt = moment(props.task.startedAt);
      const endedAt = moment(props.task.endedAt);
      const duration = moment.duration(endedAt.diff(startedAt));
      return duration.asHours();
    });

    const overdueTimeInHours = computed(() => {
      return passedTimeInHours.value - props.task.estimate;
    });

    onMounted(() => {
      setInterval(() => {
        now.value = moment();
      }, 1000);
    });

    return {
      passedTimeInHours,
      remainingTimeInHours,
      progressPercentage,
      isCompleted,
      isOverdue,
      completedTimeInHours,
      overdueTimeInHours
    };
  }
});
</script>
