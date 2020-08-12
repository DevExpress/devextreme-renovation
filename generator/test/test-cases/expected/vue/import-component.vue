<template>
  <Base :height="__getProps().height" />
</template>
<script>
import Base, { WidgetProps } from "./component-input";

const ChildInput = {
  ...WidgetProps,
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
};
export const DxChild = {
  components: {
    Base,
  },
  props: ChildInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        height: this.height,
        onClick: this.onClick,
        width: this.width,
        children: this.$slots.default,
      };
    },
  },
  methods: {
    __getProps() {
      return { height: this.height };
    },
    onClick(...args) {
      this.$emit("click", ...args);
    },
  },
};
export default DxChild;
</script>
