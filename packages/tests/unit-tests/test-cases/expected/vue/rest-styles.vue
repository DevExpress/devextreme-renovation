<template>
  <span v-bind:style="__processStyle(__styles)"></span>
</template>
<script>
const modifyStyles = (styles) => {
  return { height: "100px", ...styles };
};
const WidgetInput = {};
import { normalizeStyles } from "@devextreme/runtime/common";

export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  computed: {
    __styles() {
      const { style } = this.__restAttributes;
      return modifyStyles(style);
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  methods: {
    __processStyle(value) {
      return normalizeStyles(value);
    },
  },
};
export default DxWidget;
</script>
