<template>
  <section>
    <b-field>
      <template slot="label">
        <tags-edit ref="tagsEdit">
          <a @click="$refs.tagsEdit.toggle()">Tags</a>
        </tags-edit>
      </template>
      <tag-input :tags="tags" @tag-added="addTag" @tag-deleted="deleteTag" />
    </b-field>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TagInput from '~/components/shared/TagInput.vue'
import TagsEdit from '~/components/shared/TagsEdit.vue'
import TagTask from '~/models/TagTask'

export default defineComponent({
  name: 'Tags',
  components: { TagInput, TagsEdit },
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  setup (props, { root }) {
    const addTag = async tag => {
      await TagTask.insert({
        data: {
          task_id: root.$route.params.task_id,
          tag_id: tag.id
        }
      })
    }

    const deleteTag = async tagId => {
      await TagTask.delete(tagTask => {
        return (
          tagTask.task_id === root.$route.params.task_id &&
          tagTask.tag_id === tagId
        )
      })
    }

    return { addTag, deleteTag }
  }
})
</script>
