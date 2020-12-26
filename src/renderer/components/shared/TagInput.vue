<template>
  <b-taginput
    ref="taginput"
    v-model="selectedTags"
    :data="data"
    autocomplete
    ellipsis
    :allow-new="allowNew"
    :open-on-focus="true"
    icon="label"
    placeholder="Add a tag"
    :create-tag="(tagToAdd) => createTag(tagToAdd)"
    @add="addTag"
    @remove="removeTag"
    @typing="filterData"
  >
    <template slot-scope="props">
      <div class="media">
        <div class="media-left">
          <b-icon icon="circle" :type="props.option.type" size="is-small" />
        </div>
        <div class="media-content">
          {{ props.option.name }}
        </div>
      </div>
    </template>
    <template slot="empty"> There are no tags</template>
    <template slot="selected" slot-scope="props">
      <b-tag
        v-for="(tag, index) in props.tags"
        :key="index"
        rounded
        :tabstop="false"
        :type="tag.type"
        ellipsis
        closable
        @close="$refs.taginput.removeTag(index, $event)"
      >
        {{ tag.name }}
      </b-tag>
    </template>
  </b-taginput>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from '@nuxtjs/composition-api'
import Tag from '~/models/Tag'

export default defineComponent({
  name: 'TagInput',
  props: {
    tags: {
      type: Array,
      default: ''
    },
    allowNew: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const keyword = ref(null)

    const data = computed(() => {
      let q = Tag.query()

      if (keyword.value !== null && keyword.value !== '') {
        q = q.search(keyword.value)
      }

      return q.get()
    })
    const selectedTags = computed({
      get: () => props.tags,
      set: () => {}
    })

    const filterData = value => {
      keyword.value = value
    }

    const addTag = async value => {
      if (props.allowNew) {
        if (typeof value === 'string') {
          const tag = await Tag.insert({
            data: {
              name: value
            }
          })
          emit('tag-added', tag.tags[0])
        } else {
          const tag = await Tag.query().where('name', value.name).first()
          if (tag) {
            emit('tag-added', tag)
          }
        }
      }
    }

    const removeTag = async tag => {
      emit('tag-deleted', tag.id)
    }

    const init = async () => {
      selectedTags.value = props.tags
    }

    const createTag = tag => {
      if (typeof tag === 'string') {
        return { name: tag, description: '' }
      }
      return tag
    }

    onMounted(() => init())

    return { data, selectedTags, filterData, addTag, removeTag, createTag }
  }
})
</script>
