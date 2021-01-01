<template>
  <div id="editor" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useContext,
  watch
} from "@nuxtjs/composition-api";
import EditorJS from "@editorjs/editorjs";
import CodeMirrorTool from "~/plugins/editor/code-mirror";
import AlertTool from "~/plugins/editor/alert/alert";
import Helpers from "~/plugins/helpers";
import Setting from "~/models/Setting";

export const PLUGINS = {
  header: require("@editorjs/header"),
  list: require("@editorjs/list"),
  inlineCode: require("@editorjs/inline-code"),
  marker: require("@editorjs/marker"),
  code: require("@editorjs/code"),
  delimiter: require("@editorjs/delimiter"),
  table: require("@editorjs/table"),
  checklist: require("@editorjs/checklist"),
  paragraph: require("@editorjs/paragraph"),
  code_mirror_tool: CodeMirrorTool,
  alert: {
    class: AlertTool,
    inlineToolbar: true
  }
};

export default defineComponent({
  name: "Editor",
  props: {
    value: {
      type: Array,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit, root }) {
    const editor = ref<EditorJS>(null);
    const { params } = useContext();

    const isDarkMode = computed(
      () => Setting.get("dark_mode", false) === "true"
    );

    const initEditor = () => {
      editor.value = new EditorJS({
        holder: "editor",
        autofocus: true,
        inlineToolbar: true,
        readOnly: props.readOnly,
        tools: {
          header: {
            class: PLUGINS.header,
            config: {
              defaultLevel: 5
            }
          },
          list: PLUGINS.list,
          inlineCode: PLUGINS.inlineCode,
          marker: PLUGINS.marker,
          delimiter: PLUGINS.delimiter,
          table: PLUGINS.table,
          checklist: PLUGINS.checklist,
          code_mirror: {
            class: PLUGINS.code_mirror_tool,
            shortcut: "CMD+SHIFT+C",
            config: {
              theme: isDarkMode.value ? "dracula" : "default"
            }
          },
          alert: PLUGINS.alert
        },
        onReady: () => {
          emit("ready", true);
        },
        onChange: args => {
          if (!props.readOnly) {
            emit("change", true);
          }
        },
        // @ts-ignore
        logLevel: "ERROR",
        // @ts-ignore
        data: { blocks: props.value }
      });
    };

    const saveEditor = async () => {
      if (editor.value && !props.readOnly) {
        return editor.value.save();
      }
    };

    const destroyEditor = async () => {
      if (editor.value) {
        editor.value.destroy();
      }
    };

    const reRender = async () => {
      if (editor.value) {
        editor.value.isReady
          .then(async () => {
            console.log("Editor is ready for the task.");
            // @ts-ignore
            await editor.value.blocks.render({ blocks: props.value });
          })
          .catch(reason => {
            console.log(`Editor initialization failed because of ${reason}`);
          });
      }
    };

    const toggleReadOnly = value => {
      editor.value.readOnly.toggle(value);
    };

    const openInBrowser = () => {
      const func = function(event) {
        if (
          event.target.tagName.toLowerCase() === "a" &&
          event.target.parentElement &&
          event.target.parentElement.classList.contains("cdx-block") &&
          event.target.protocol !== "file:"
        ) {
          event.preventDefault();
          Helpers.openLinkInBrowser(event.target.href);
        }
      };
      document.body.addEventListener("click", func);
    };

    watch(
      () => isDarkMode.value,
      () => {
        destroyEditor();
        initEditor();
      }
    );

    watch(
      () => params.value.task_id,
      () => {
        reRender();
      }
    );

    watch(
      () => props.readOnly,
      value => {
        toggleReadOnly(value);
      }
    );

    onMounted(() => {
      initEditor();
      openInBrowser();
    });

    onBeforeUnmount(() => {
      destroyEditor();
    });

    return { props, saveEditor };
  }
});
</script>
