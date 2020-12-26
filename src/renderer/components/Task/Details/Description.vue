<template>
  <div @click="disabledReadOnly">
    <editor
      ref="editorRef"
      v-model="blocks"
      v-click-outside="enableReadOnly"
      :read-only="readOnly"
      @change="editorChanged"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Editor from '@/components/shared/Editor.vue'
import Task from '@/models/Task'
import moment from 'moment'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'Description',
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  components: {
    Editor
  },
  setup (props, { root }) {
    const readOnly = ref<boolean>(true)
    const editorRef = ref(null)

    const editorChanged = async () => {
      const data = await editorRef.value.saveEditor()
      await saveDescription(data.blocks)
    }

    const saveDescription = async blocks => {
      await Task.update({
        where: root.$route.params.task_id,
        data: { blocks, updatedAt: moment().toDate().toISOString() }
      })
    }

    const disabledReadOnly = debounce(() => {
      readOnly.value = false
    }, 150)

    const enableReadOnly = () => {
      readOnly.value = true
    }

    return {
      readOnly,
      editorRef,
      editorChanged,
      disabledReadOnly,
      enableReadOnly
    }
  }
})
</script>
