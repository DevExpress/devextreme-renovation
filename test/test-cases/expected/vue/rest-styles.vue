<template>
  <span v-bind:style="__processStyle(__styles)"></span>
</template>
<script>
const modifyStyles = (styles) => {
  return { height: "100px", ...styles };
};
const WidgetInput = {};
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
  },
};
export default DxWidget;
</script>
