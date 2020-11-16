<template>
  <InnerWidget
    v-bind="{ ...props, ...{ valueChange: undefined } }"
    @update:value="valueChange"
  />
</template>
<script>
import InnerWidget from "./dx-inner-widget";
export const WidgetInput = {
  visible: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
  value: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
};
export const DxWidget = {
  name: "Widget",
  components: {
    InnerWidget,
  },
  props: WidgetInput,
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
    __restAttributes() {
      return {};
    },
    props() {
      return {
        ...(this.visible !== undefined && { visible: this.visible }),
        ...(this.value_state !== undefined && { value: this.value_state }),
        valueChange: this.valueChange,
      };
    },
  },
  watch: {
    value: ["__value_watcher"],
  },
  methods: {
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    __value_watcher(s) {
      this.value_state = s;
    },
  },
};
export default DxWidget;
</script>
