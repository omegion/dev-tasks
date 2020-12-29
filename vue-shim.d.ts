import Vue from "vue";
import { Emitter } from "mitt";

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vue/types/vue" {
  interface Vue {
    $emitter: Emitter;
  }
}
