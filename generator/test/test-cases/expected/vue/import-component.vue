<template>
  <Base :height="getProps().height" />
</template>
<script>
import Base, { WidgetProps } from "./component-input";

const ChildInput = {
  ...WidgetProps,
  height: {
    type: Number,
    default() {
      return 10;
    }
  }
};
export default {
  components: {
    Base
  },
  props: ChildInput,
  methods: {
    getProps() {
      return { height: this.height };
    },
    __restAttributes() {
      return {};
    },
    onClick(...args){
      this.$emit("on-click", ...args);
    }
  }
};
</script>
        