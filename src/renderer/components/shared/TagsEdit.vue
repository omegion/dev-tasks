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
        <b-field v-if="!isSelected" label="Tags">
          <b-autocomplete
            v-model="keyword"
            placeholder="e.g. Productivity"
            :open-on-focus="true"
            :data="data"
            field="name"
            :clearable="true"
            @select="option => (selected = option)"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <b-icon
                    icon="circle"
                    :type="props.option.type"
                    size="is-small"
                  />
                </div>
                <div class="media-content">
                  {{ props.option.name }}
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>
        <ValidationObserver v-else ref="observer" v-slot="{ handleSubmit }">
          <ValidationProvider v-slot="{ errors }" rules="required" name="Name">
            <b-field
              label="Name"
              :type="{ 'is-danger': errors[0] }"
              :message="errors"
            >
              <b-input v-model="selected.name" placeholder="e.g. My label" />
            </b-field>
          </ValidationProvider>
          <b-field label="Color">
            <b-dropdown v-model="selected.type" aria-role="list">
              <button slot="trigger" class="button" type="button">
                <template>
                  <b-icon icon="circle" :type="selected.type" />
                  <span class="pl-1">{{ getNameByType(selected.type) }}</span>
                </template>
                <b-icon icon="menu-down" />
              </button>

              <b-dropdown-item
                v-for="(type, index) in types"
                :key="index"
                :value="type"
                aria-role="listitem"
              >
                <div class="media">
                  <b-icon class="media-left" icon="circle" :type="type" />
                  <div class="media-content">
                    <span class="is-size-6">{{ getNameByType(type) }}</span>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </b-field>
          <b-field label="Description">
            <b-input
              v-model="selected.description"
              placeholder="e.g. great label"
            />
          </b-field>
          <div class="footer">
            <div class="buttons">
              <b-button
                v-if="isSelected"
                type="is-primary"
                :loading="saveButtonLoading"
                @click="handleSubmit(updateTag)"
              >
                Save
              </b-button>
              <b-button
                v-if="isSelected"
                type="is-danger"
                :loading="deleteButtonLoading"
                @click="deleteTagConfirm"
              >
                Delete
              </b-button>
              <b-button @click="toggle">Cancel</b-button>
            </div>
          </div>
        </ValidationObserver>
        <div v-if="!isSelected" class="footer">
          <b-button @click="toggle">Cancel</b-button>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import {
  ValidationObserver,
  ValidationProvider
} from "vee-validate/dist/vee-validate.full";
import Tag from "~/models/Tag";
import Helpers from "~/plugins/helpers";
import { DialogProgrammatic as Dialog } from "buefy";

export default defineComponent({
  name: "TagsEdit",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const keyword = ref(null);
    const selected = ref<Tag>(null);
    const types = ref(["is-primary", "is-danger", "is-success", "is-light"]);
    const saveButtonLoading = ref(false);
    const deleteButtonLoading = ref(false);

    const toggle = () => {
      selected.value = null;
      showModal.value = !showModal.value;
    };

    const data = computed(() => {
      let q = Tag.query();

      if (keyword.value !== null && keyword.value !== "") {
        // @ts-ignore
        q = q.search(keyword.value);
      }

      return q.get();
    });

    const isSelected = computed(() => selected.value);

    const getNameByType = type => {
      const data = {
        "is-primary": "Blue",
        "is-danger": "Red",
        "is-success": "Green",
        "is-light": "Grey"
      };
      return data[type];
    };

    const updateTag = async () => {
      saveButtonLoading.value = true;
      await Tag.update({
        where: selected.value.id,
        data: {
          name: selected.value.name,
          type: selected.value.type,
          description: selected.value.description
        }
      }).finally(async () => {
        await Helpers.delay(200);
        saveButtonLoading.value = false;
        toggle();
      });
    };

    const deleteTagConfirm = () => {
      Dialog.confirm({
        title: "Delete Tag",
        message: `You're about to delete <strong>${selected.value.name}</strong>. This cannot be undone.`,
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => deleteTag()
      });
    };

    const deleteTag = async () => {
      deleteButtonLoading.value = true;
      await Tag.delete(selected.value.id).finally(async () => {
        await Helpers.delay(200);
        deleteButtonLoading.value = false;
        toggle();
      });
    };

    return {
      showModal,
      data,
      keyword,
      selected,
      types,
      isSelected,
      saveButtonLoading,
      deleteButtonLoading,
      toggle,
      getNameByType,
      updateTag,
      deleteTagConfirm
    };
  }
});
</script>
