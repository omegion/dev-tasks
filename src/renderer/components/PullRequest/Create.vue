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
      class="is-medium is-right"
    >
      <div class="section">
        <b-field label="Repositories">
          <b-autocomplete
            v-model="keyword"
            placeholder="e.g. My Repository"
            :open-on-focus="true"
            :data="repositories"
            field="name"
            :clearable="true"
            @select="option => (selected = option)"
            @input="getPullRequests"
          >
            <template slot-scope="props">
              <span>
                <span class="has-text-weight-medium">
                  {{ props.option.name }}
                </span>
                <span class="is-size-7 has-text-grey">{{
                  props.option.repository
                }}</span>
              </span>
            </template>
          </b-autocomplete>
        </b-field>
        <div v-if="isSelected">
          <b-field label="Pull Request">
            <b-autocomplete
              v-model="pullRequestKeyword"
              :open-on-focus="true"
              :data="filteredPullRequests"
              :clearable="true"
              :loading="isPullRequestsFetching"
              field="title"
              placeholder="e.g. Pull Request"
              @select="option => (selectedPullRequest = option)"
            >
              <template slot-scope="props">
                {{ props.option.title }}
              </template>
            </b-autocomplete>
          </b-field>
        </div>
        <div class="footer">
          <div class="buttons">
            <b-button
              v-if="isSelected"
              type="is-primary"
              :loading="saveButtonLoading"
              @click="addPullRequest"
            >
              Add
            </b-button>
            <b-button @click="toggle">Cancel</b-button>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext
} from "@nuxtjs/composition-api";
import { SnackbarProgrammatic as Snackbar } from "buefy";
import Repository from "~/models/Repository";
import PullRequest from "~/models/PullRequest";
import PullRequestTask from "~/models/PullRequestTask";

class Pull {
  number: number;
  title: string;
  locked: boolean;
  state: string;
  updatedAt: string;
  createdAt: string;

  constructor(
    number: number,
    title: string,
    locked: boolean,
    state: string,
    updatedAt: string,
    createdAt: string
  ) {
    this.number = number;
    this.title = title;
    this.locked = locked;
    this.state = state;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

export default defineComponent({
  name: "Create",
  setup(props, { emit }) {
    const showModal = ref(false);
    const keyword = ref(null);
    const pullRequestKeyword = ref("");
    const selected = ref<Repository>(null);
    const selectedPullRequest = ref<Pull>(null);
    const pullRequests = ref<Pull[]>([]);
    const saveButtonLoading = ref(false);
    const isPullRequestsFetching = ref(false);

    const { params } = useContext();

    const resetForm = () => {
      keyword.value = null;
      selected.value = null;
      selectedPullRequest.value = null;
      pullRequestKeyword.value = "";
    };

    const toggle = () => {
      resetForm();
      showModal.value = !showModal.value;
    };

    const repositories = computed(() => {
      let q = Repository.query();

      if (keyword.value !== null && keyword.value !== "") {
        // @ts-ignore
        q = q.search(keyword.value);
      }

      return q.get();
    });

    const isSelected = computed(() => selected.value);

    const filteredPullRequests = computed(() => {
      return pullRequests.value.filter(option => {
        return option.title
          .toString()
          .toLowerCase()
          .includes(pullRequestKeyword.value.toLowerCase());
      });
    });

    const getPullRequests = async () => {
      pullRequests.value = [];
      isPullRequestsFetching.value = true;
      if (selected.value) {
        await selected.value
          .pulls()
          .then(({ data }) => {
            data.forEach(item => {
              pullRequests.value.push(
                new Pull(
                  item.number,
                  item.title,
                  item.locked,
                  item.state,
                  item.updated_at,
                  item.created_at
                )
              );
            });
          })
          .catch(err => {
            console.error(err);
            Snackbar.open(err.toString());
          })
          .finally(() => {
            isPullRequestsFetching.value = false;
          });
      }
    };

    const addPullRequest = async () => {
      saveButtonLoading.value = true;
      const insertResponse = await PullRequest.insert({
        data: {
          name: selectedPullRequest.value.title,
          pull_number: selectedPullRequest.value.number,
          locked: selectedPullRequest.value.locked,
          state: selectedPullRequest.value.state,
          updatedAt: selectedPullRequest.value.updatedAt,
          createdAt: selectedPullRequest.value.createdAt,
          repository_id: selected.value.$id
        }
      });

      const pullRequest = insertResponse.pull_requests[0];
      await PullRequestTask.insert({
        data: {
          // @ts-ignore
          pull_request_id: pullRequest.id,
          task_id: params.value.task_id
        }
      }).then(async res => {
        // @ts-ignore
        await pullRequest.sync(false);
        saveButtonLoading.value = false;
        toggle();
      });
    };

    return {
      showModal,
      repositories,
      keyword,
      pullRequestKeyword,
      selected,
      selectedPullRequest,
      isSelected,
      saveButtonLoading,
      filteredPullRequests,
      isPullRequestsFetching,
      toggle,
      addPullRequest,
      getPullRequests
    };
  }
});
</script>
