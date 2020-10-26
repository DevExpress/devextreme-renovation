<template>
  <div>{{ value_state }}</div>
</template>
<script>
const ModelWidgetInput = {
  disabled: {
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
  notValue: {
    type: Boolean,
    default() {
      return undefined;
    },
  },
};
export const DxModelWidget = {
  props: ModelWidgetInput,
  model: {
    prop: "value",
    event: "update:value",
  },
  data() {
    return {
      value_state: this.value,
      notValue_state: this.notValue,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        ...(this.disabled !== undefined && { disabled: this.disabled }),
        ...(this.value_state !== undefined && { value: this.value_state }),
        ...(this.notValue_state !== undefined && {
          notValue: this.notValue_state,
        }),
        valueChange: this.valueChange,
        notValueChange: this.notValueChange,
      };
    },
  },
  watch: {
    value: ["__value_watcher"],
    notValue: ["__notValue_watcher"],
  },
  methods: {
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    notValueChange(...args) {
      this.$emit("update:not-value", ...args);
    },
    __value_watcher(s) {
      this.value_state = s;
    },
    __notValue_watcher(s) {
      this.notValue_state = s;
    },
  },
};
export default DxModelWidget;
</script>
