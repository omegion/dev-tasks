import { isRef, ref, watch } from "@nuxtjs/composition-api";

const { shell } = require("electron");

export default class Helpers {
  static delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  static useDebounceValue = (value, delay = 1000) => {
    const debounceValue = ref(isRef(value) ? value.value : value);
    const isLoading = ref(false);

    watch(value, (v, oldV, clean) => {
      isLoading.value = true;
      let theTimeout = setTimeout(() => {
        debounceValue.value = v;
        isLoading.value = false;
      }, delay);
      clean(() => {
        clearTimeout(theTimeout);
      });
    });
    return [debounceValue, isLoading];
  };

  static getIllustration = (name, type = null) => {
    let typeName = "";
    if (type === "solid") {
      typeName = `_${type}`;
    }

    let fileName = `${name}${typeName}.png`;

    return require(`~/assets/illustrations/${fileName}`);
  };

  static openLinkInBrowser = (url) => {
    shell.openExternal(url);
  };
}
