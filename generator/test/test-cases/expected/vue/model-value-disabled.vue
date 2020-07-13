<template>
  <div>{{(value !== undefined ? value : value_state)}}</div>
</template>
<script>
const ModelWidgetInput = {
  disabled: {
    type: Boolean,
  },
  value: {
    type: Boolean,
    default: undefined,
  },
  notValue: {
    type: Boolean,
    default: undefined,
  },
  defaultValue: {
    type: Boolean,
  },
  defaultNotValue: {
    type: Boolean,
  },
};
export default {
  props: ModelWidgetInput,
  model: {
    prop: "value",
    event: "update:value",
  },
  data() {
    return {
      value_state: this.defaultValue,
      notValue_state: this.defaultNotValue,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        disabled: this.disabled,
        value: this.value !== undefined ? this.value : this.value_state,
        notValue:
          this.notValue !== undefined ? this.notValue : this.notValue_state,
        valueChange: this.valueChange,
        notValueChange: this.notValueChange,
      };
    },
  },
  methods: {
    valueChange(...args) {
      this.$emit("update:value", ...args);
    },
    notValueChange(...args) {
      this.$emit("update:not-value", ...args);
    },
  },
};
</script>
