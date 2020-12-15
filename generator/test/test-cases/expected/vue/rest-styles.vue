<template>
  <span v-bind:style="__processStyle(__styles)"></span>
</template>
<script>
const modifyStyles = (styles) => {
  return { height: "100px", ...styles };
};
const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  p: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetInput,
  data() {
    return {
      p_state: this.p,
    };
  },
  computed: {
    __styles() {
      const { style } = this.__restAttributes;
      return modifyStyles(style);
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        onClick: this.onClick,
        p: this.p_state,
        pChange: this.pChange,
      };
    },
  },
  watch: {
    p: ["__p_watcher"],
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
    onClick(...args) {
      this.$emit("click", ...args);
    },
    pChange(...args) {
      this.$emit("update:p", ...args);
    },
    __p_watcher(s) {
      this.p_state = s;
    },
  },
};
export default DxWidget;
</script>
