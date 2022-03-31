<template>
  <tr
    ><template v-for="height of __cells"
      ><td v-bind:style="__processStyle({ height })" /></template
  ></tr>
</template>
<script>
const WidgetInput = {};
import { normalizeStyles } from "@devextreme/runtime/common";

export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  computed: {
    __cells() {
      return [];
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
