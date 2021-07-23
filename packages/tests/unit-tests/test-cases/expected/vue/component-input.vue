<template>
  <div></div>
</template>
<script>
export const COMPONENT_INPUT_CLASS = "c3";
export const WidgetProps = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  width: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        width: this.width,
        children: this.$slots.default,
      };
    },
  },
  methods: {
    __onClick() {
      const v = this.height;
    },
  },
};
export default DxWidget;
</script>
