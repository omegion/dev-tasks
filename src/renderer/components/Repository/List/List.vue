<template>
  <section>
    <list-header v-model="keyword" />
    <div class="repository-list">
      <b-table
        :data="repositories"
        :row-class="(row, index) => row.id === routeTaskId && 'is-selected'"
        :hoverable="true"
      >
        <b-table-column v-slot="props" field="name">
          <list-item :repository="props.row" />
        </b-table-column>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-confused-outline" size="is-medium" />
              </p>
              <p>No repository found.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
    <list-footer />
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext
} from "@nuxtjs/composition-api";
import ListItem from "~/components/Repository/List/Item.vue";
import ListFooter from "~/components/Repository/List/Footer/Footer.vue";
import ListHeader from "~/components/Repository/List/Header/Header.vue";
import Repository from "~/models/Repository.ts";

export default defineComponent({
  name: "NavBar",
  components: {
    ListItem,
    ListFooter,
    ListHeader
  },
  setup(props, { root }) {
    const keyword = ref(null);
    const tags = ref([]);

    const { params } = useContext();

    const repositories = computed(() => {
      let repositories = Repository.query();

      if (keyword.value != null && keyword.value !== "") {
        // @ts-ignore
        repositories = repositories.search(keyword.value);
      }

      return repositories.orderBy("name", "desc").get();
    });

    const routeTaskId = () => {
      return root.$route.params.task_id;
    };

    return { keyword, tags, routeTaskId, repositories, params };
  }
});
</script>
