<template>
  <div v-bind:style="__processStyle({ width: 100, height: 100 })"></div>
</template>
<script>
export const InnerWidgetProps = {
  selected: {
    type: Boolean,
  },
  value: {
    type: Number,
    default() {
      return 14;
    },
  },
};
export const DxInnerWidget = {
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
    __restAttributes() {
      return {};
    },
    props() {
      return {
        selected: this.selected,
        value: this.value_state,
        onSelect: this.onSelect,
        valueChange: this.valueChange,
      };
    },
  },
  watch: {
    value: ["__value_watcher"],
  },
  methods: {
    __processStyle(value) {
      if (typeof value === "object") {
        return Object.keys(value).reduce((v, k) => {
          if (typeof value[k] === "number") {
            v[k] = value[k] + "px";
          } else {
            v[k] = value[k];
          }
          return v;
        }, {});
      }
      return value;
    },
    onSelect(...args) {
      this.$emit("select", ...args);
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
