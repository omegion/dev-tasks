<template>
  <div id="editor" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'
import EditorJS from '@editorjs/editorjs'
import CodeMirrorTool from '~/plugins/editor/code-mirror'
import Helpers from '~/plugins/helpers'

export const PLUGINS = {
  header: require('@editorjs/header'),
  list: require('@editorjs/list'),
  inlineCode: require('@editorjs/inline-code'),
  marker: require('@editorjs/marker'),
  code: require('@editorjs/code'),
  delimiter: require('@editorjs/delimiter'),
  table: require('@editorjs/table'),
  checklist: require('@editorjs/checklist'),
  paragraph: require('@editorjs/paragraph'),
  code_mirror_tool: CodeMirrorTool
}

export default defineComponent({
  name: 'Editor',
  props: {
    value: {
      type: Array,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit, root }) {
    const editor = ref<EditorJS>(null)
    const { params } = useContext()

    const initEditor = () => {
      return new EditorJS({
        holder: 'editor',
        autofocus: true,
        inlineToolbar: true,
        readOnly: props.readOnly,
        tools: {
          header: PLUGINS.header,
          list: PLUGINS.list,
          inlineCode: PLUGINS.inlineCode,
          marker: PLUGINS.marker,
          delimiter: PLUGINS.delimiter,
          table: PLUGINS.table,
          checklist: PLUGINS.checklist,
          code_mirror: PLUGINS.code_mirror_tool
        },
        onReady: () => {
          emit('ready', true)
        },
        onChange: args => {
          if (!props.readOnly) {
            emit('change', true)
          }
        },
        // @ts-ignore
        logLevel: 'ERROR',
        // @ts-ignore
        data: { blocks: props.value }
      })
    }

    const saveEditor = async () => {
      if (editor.value && !props.readOnly) {
        return editor.value.save()
      }
    }

    const destroyEditor = async () => {
      if (editor.value) {
        editor.value.destroy()
      }
    }

    const reRender = async () => {
      if (editor.value) {
        editor.value.isReady
          .then(async () => {
            console.log('Editor is ready for the task.')
            // @ts-ignore
            await editor.value.blocks.render({ blocks: props.value })
          })
          .catch(reason => {
            console.log(`Editor initialization failed because of ${reason}`)
          })
      }
    }

    const toggleReadOnly = value => {
      editor.value.readOnly.toggle(value)
    }

    const openInBrowser = () => {
      const func = function (event) {
        if (
          event.target.tagName.toLowerCase() === 'a' &&
          event.target.parentElement &&
          event.target.parentElement.classList.contains('cdx-block') &&
          event.target.protocol !== 'file:'
        ) {
          event.preventDefault()
          Helpers.openLinkInBrowser(event.target.href)
        }
      }
      document.body.addEventListener('click', func)
    }

    watch(
      () => params.value.task_id,
      () => {
        reRender()
      }
    )

    watch(
      () => props.readOnly,
      value => {
        toggleReadOnly(value)
      }
    )

    onMounted(() => {
      editor.value = initEditor()
      openInBrowser()
    })

    onBeforeUnmount(() => {
      destroyEditor()
    })

    return { props, saveEditor }
  }
})
</script>
