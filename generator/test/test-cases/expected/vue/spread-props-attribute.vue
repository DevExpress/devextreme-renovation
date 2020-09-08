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
  },
  value: {
    type: Boolean,
  },
};
export const DxWidget = {
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
        visible: this.visible,
        value: this.value_state,
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
