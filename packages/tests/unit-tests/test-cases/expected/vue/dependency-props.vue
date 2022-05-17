<template>
  <div v-bind:style="__processStyle({ width: 100, height: 100 })"></div>
</template>
<script>
export const InnerWidgetProps = {
  visible: {
    type: Boolean,
    default() {
      return true;
    },
  },
  selected: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
  value: {
    type: Number,
    default() {
      return 14;
    },
  },
  required: {
    type: Boolean,
    required: true,
    default() {
      return undefined;
    },
  },
};
import { normalizeStyles } from "@devextreme/runtime/common";

export const DxInnerWidget = {
  name: "InnerWidget",
  props: InnerWidgetProps,
  model: {
    prop: "value",
    event: "update:value",
  },
  data() {
    return {
      value_state: this.value,
    };
  },
  computed: {
    __someGetter() {
      return this.value_state.toString() + this.required.toString();
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        visible: this.visible,
        ...(this.selected !== undefined && { selected: this.selected }),
        value: this.value_state,
        required: this.required,
        valueChange: this.valueChange,
      };
    },
  },
  watch: {
    value: ["__value_watcher"],
  },
  methods: {
    __processStyle(value) {
      return normalizeStyles(value);
    },
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    __value_watcher(s) {
      this.value_state = s;
    },
  },
};
export default DxInnerWidget;
</script>
