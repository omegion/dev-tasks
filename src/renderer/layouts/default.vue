<template>
  <div class="">
    <side-bar />
    <div :class="['main-wrap', { 'sidebar-mini': isSidebarReduced }]">
      <div class="columns inner-wrap">
        <div
          class="column is-narrow has-border-right is-inner-left"
          ref="leftSideRef"
          :style="innerLeftSideStyle"
        >
          <portal-target name="inner-left" />
        </div>
        <div class="column is-inner-center" ref="centerSideRef">
          <nuxt />
        </div>
        <div
          class="column is-narrow is-inner-right"
          ref="rightSideRef"
          :style="innerRightSideStyle"
        >
          <portal-target name="inner-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Setting from "@/models/Setting";
import SideBar from "@/components/SideBar/SideBar.vue";
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from "@nuxtjs/composition-api";
import interact from "interactjs";
import { debounce } from "lodash";
import PerfectScrollbar from "perfect-scrollbar";

const DEFAULT_LEFT_INNER_SIDE_WIDTH: number = 250;
const MIN_LEFT_INNER_SIDE_WIDTH: number = 180;
const MAX_LEFT_INNER_SIDE_WIDTH: number = 480;

const DEFAULT_RIGHT_INNER_SIDE_WIDTH: number = 250;
const MIN_RIGHT_INNER_SIDE_WIDTH: number = 180;
const MAX_RIGHT_INNER_SIDE_WIDTH: number = 480;

export default defineComponent({
  components: { SideBar },
  setup({ root }) {
    const centerSideRef = ref(null);
    const leftSideRef = ref(null);
    const rightSideRef = ref(null);

    const sidebarMini = computed(() =>
      Setting.query()
        .where("name", "sidebar_mini")
        .first()
    );

    const innerLeftSideStyle = computed(() => {
      return {
        width: `${Setting.get(
          "inner_left_side_width",
          DEFAULT_LEFT_INNER_SIDE_WIDTH
        )}px`
      };
    });

    const innerRightSideStyle = computed(() => {
      return {
        width: `${Setting.get(
          "inner_right_side_width",
          DEFAULT_RIGHT_INNER_SIDE_WIDTH
        )}px`
      };
    });

    const isSidebarReduced = computed(
      () => sidebarMini.value === null || sidebarMini.value.value === "false"
    );

    const initInteract = () => {
      interact(leftSideRef.value).resizable({
        delay: 100,
        edges: { right: true },
        listeners: {
          move(event) {
            let target = event.target;
            target.style.width = event.rect.width + "px";
            saveInnerLeftSideWidth(event.rect.width);
          }
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: MIN_LEFT_INNER_SIDE_WIDTH, height: 0 },
            max: { width: MAX_LEFT_INNER_SIDE_WIDTH, height: 0 }
          })
        ]
      });

      interact(rightSideRef.value).resizable({
        delay: 100,
        edges: { left: true },
        listeners: {
          move(event) {
            let target = event.target;
            target.style.width = event.rect.width + "px";
            saveInnerRightSideWidth(event.rect.width);
          }
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: MIN_RIGHT_INNER_SIDE_WIDTH, height: 0 },
            max: { width: MAX_RIGHT_INNER_SIDE_WIDTH, height: 0 }
          })
        ]
      });
    };

    const perfectScrollBar = () => {
      const ps = new PerfectScrollbar(centerSideRef.value, {
        wheelPropagation: true
      });
    };

    const saveInnerLeftSideWidth = debounce(width => {
      Setting.set("inner_left_side_width", width);
    }, 500);

    const saveInnerRightSideWidth = debounce(width => {
      Setting.set("inner_right_side_width", width);
    }, 500);

    onMounted(() => {
      initInteract();
      perfectScrollBar();
    });

    return {
      centerSideRef,
      leftSideRef,
      rightSideRef,
      isSidebarReduced,
      innerLeftSideStyle,
      innerRightSideStyle
    };
  }
});
</script>
